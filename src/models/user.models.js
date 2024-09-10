import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import JsonWebToken  from "jsonwebtoken"
const userSchema = new Schema({
    user: {
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
        required: true,

    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"

    }],
    coverImage: {
        type: String,
        required: true,

    }



}, {
    timestamps: true
})



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        await bcrypt.hash(this.password, 10)

    } catch (error) {
        console.log(error);

    }
    next()
})

userSchema.methods.comparePassword = async function (password) {
    bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function (params) {
    return JsonWebToken.sign({
        id: this._id,
        email: this.email,
        user: this.user,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiryIN: ACCESS_TOKEN_EXPIRY }
    )
}
userSchema.methods.generateRefreshToken = async function (params) {
    return JsonWebToken.sign({
        id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiryIN: REFRESH_TOKEN_EXPIRY }
    )
}
export const User = mongoose.model("User", userSchema)