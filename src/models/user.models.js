import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 3
    },
    fullname: {
        type: String,
        required: true,
        minlength: 3
    },
    avatar: {
        type: String,
        required: true,

    },
    refreshToken: {
        type: String,


    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"

    }],
    coverImage: {
        type: String,


    }



}, {
    timestamps: true
})



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10)

    } catch (error) {
        console.log(error);
        next(error)
    }
    next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        user: this.user,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}
export const User = mongoose.model("User", userSchema)