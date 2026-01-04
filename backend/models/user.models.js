import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { use } from "bcrypt/promises";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        required: false
    },
    coverimage: {
        type: String, //cloudinary url
    },
    watchHistory: {
        type: [{ type: Schema.Types.ObjectId, ref: "Video" }],
        default: []
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },

}, {
    timestamps: true
})


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAuthToken = function () {
    const payload = {
        id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
}


UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
}

export const User = mongoose.model("User", UserSchema);