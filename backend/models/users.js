const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: ["doctor", "patient"], 
        default: "patient" 
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.createJWT = function () {
    return jwt.sign({id: this._id, username: this.username, role: this.role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", userSchema);