require("dotenv").config();
const express = require("express");
const User = require("./models/User");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const customError = require("./utils/customError");
const ValidateUser = require("./utils/userValidate");
const wrapAsync = require("./utils/wrapAsync");
const { bugHunterQuestions, rapidDuelQuestions, algorithmAnalysisQuestions } = require("./utils/game.controller");

const http = require("http");
const { Server } = require("socket.io");

const setUpMatchMaking = require("./socket/matchMaking");

const app = express();
const PORT = 3000;

// ================== Middleware ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== MongoDB ==================
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to mongodb!");
  console.log("Using DB:", mongoose.connection.name);
}
main().catch((err) => console.log(err));

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ================== Sessions ==================
app.use(cookieParser(process.env.SECRET));
app.set("trust proxy", 1);

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

// ================== Passport ==================
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log("🔐 Serializing user:", user._id);
  done(null, user._id);
});

passport.deserializeUser((userId, done) => {
  console.log("🧩 Deserializing User ID:", userId);
  User.findById(userId)
    .then((user) => {
      console.log("✅ User found:", user);
      done(null, user);
    })
    .catch((err) => {
      console.error("❌ Deserialize error:", err);
      done(err);
    });
});

passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));

// ================== HTTP server + Socket.IO ==================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ IMPORTANT: socket must also get cookie + session + passport
const passportSocketIo = (socket, next) => {
  sessionMiddleware(socket.request, {}, (err) => {
    if (err) return next(err);

    cookieParser(process.env.SECRET)(socket.request, {}, (err2) => {
      if (err2) return next(err2);

      passport.initialize()(socket.request, {}, (err3) => {
        if (err3) return next(err3);

        passport.session()(socket.request, {}, (err4) => {
          if (err4) return next(err4);
          next();
        });
      });
    });
  });
};

io.use(passportSocketIo);

// ✅ Setup matchmaking handlers
setUpMatchMaking(io);

// Debug socket connect
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  console.log("Connected user id:", socket.request?.user?._id || socket.request?.session?.passport?.user);
});

// ================== Routes ==================
app.get("/session-check", (req, res) => {
  if (req.isAuthenticated()) {
    req.session.touch();
    return res.send({ status: "authenticated", user: req.user });
  }
  return res.status(401).send({ status: "unauthenticated" });
});

const userValidation = (req, res, next) => {
  const response = ValidateUser.validate(req.body);
  if (response.error) {
    throw new customError(400, response.error.details[0].message);
  }
  next();
};

app.post(
  "/signup",
  userValidation,
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        res.send({ status: "signedup", user: registeredUser });
      });
    } catch (err) {
      res.status(400).send(err.message || "Error during signup");
    }
  })
);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.logIn(user, (err2) => {
      if (err2) return next(err2);
      res.json({ status: "authenticated", user });
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.send({ status: "logged out" });
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error during logout" });
  }
});

app.get("/isAuthenticated", (req, res) => {
  if (req.isAuthenticated()) return res.send({ user: req.user });
  return res.status(401).send({ status: "unauthenticated" });
});

app.use("/bug-hunter", bugHunterQuestions);
app.use("/rapid-duel", rapidDuelQuestions);
app.use("/algorithm-analysis", algorithmAnalysisQuestions);
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "CodeArena server running" });
});

// ================== Error middleware ==================
app.use((err, req, res, next) => {
  let { status = 400, message = "Something Went wrong" } = err;
  console.error(err.stack);
  res.status(status).send(message);
});

// ================== Listen ==================
server.listen(PORT, () => console.log("✅ Server running on port", PORT));
