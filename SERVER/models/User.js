const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 1200 },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    matchesDrawn: { type: Number, default: 0 },
    matchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
    }],
    lastActive: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    languagesKnown: [{ type: String }],
    avatarUrl: { type: String },
    bio: { type: String },
    country: { type: String },
});
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const User = mongoose.model('User', userSchema);
module.exports = User;