require('dotenv').config();
const express = require('express');
const User = require('./models/User');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const customError = require('./utils/customError');
const ValidateUser = require('./utils/userValidate');
const wrapAsync = require('./utils/wrapAsync');
const app = express();
const PORT = 3000;
const { Server } = require('socket.io')
const http = require('http')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb!')
    console.log('Using DB:', mongoose.connection.name);
}
//MongoDb Connection
main().catch(err => console.log(err));

//This allows backend to get session related information regarding sessions
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));



app.use(cookieParser(process.env.SECRET))
app.set('trust proxy', 1);
const sessionMiddleware = session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
});

app.use(sessionMiddleware)


// Creating an HTTP Server
const server = http.createServer(app)

// creating socketio server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


//Passport requirements
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
    console.log('🔐 Serializing user:', user._id);
    done(null, user._id); // store only the user ID in session
});

passport.deserializeUser((userId, done) => {
    console.log('🧩 Deserializing User ID:', userId);
    User.findById(userId)
        .then(user => {
            console.log('✅ User found:', user);
            done(null, user);
        })
        .catch(err => {
            console.error('❌ Deserialize error:', err);
            done(err);
        });
});
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

//Explicitly called session checking router handler to help create server to make client create a session id
app.get('/session-check', (req, res) => {
    if (req.isAuthenticated()) {
        req.session.touch(); // Keeps session alive
        return res.send({ status: 'authenticated', user: req.user });
    } else {
        return res.status(401).send({ status: 'unauthenticated' });
    }
});

const userValidation = (req, res, next) => {
    const response = ValidateUser.validate(req.body)
    if (response.error) {
        throw new customError(400, response.error.details[0].message)
    } else next()
}

app.post('/signup', userValidation, wrapAsync(async (req, res, next) => {
    try {

        let { username, email, password } = req.body
        let user = new User({ email, username })
        let registeredUser = await User.register(user, password)

        req.login(registeredUser, (err) => {
            if (err) {
                next(err)
            } else {
                console.log(req.user)
                res.send({ status: 'signedup', user: registeredUser })
            }
        })
    } catch (err) {
        res.status(400).send(err.message || 'Error during signup')
    }
}));

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, err => {
            res.json({ status: 'authenticated', user });
        });
    })(req, res, next);
});


app.get('/logout', (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                next(err)
            } else {
                req.session.destroy(() => {
                    res.clearCookie('connect.sid');
                    res.send({ status: 'logged out' });
                });
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message || 'Error during logout' })
    }
})

app.get('/isAuthenticated', (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ user: req.user });
    } else {
        res.status(401).send({ status: 'unauthenticated' });
    }
})


// SOCKET IO Routes
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id)
    const user = socket.request.session?.passport?.user;
    console.log('Connected user id:', user);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
})

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'CodeArena server running' });
});

app.use((err, req, res, next) => {
    let { status = 400, message = 'Something Went wrong' } = err
    console.error(err.stack); // inside error middleware
    res.status(status).send(message)
})


server.listen(PORT)


