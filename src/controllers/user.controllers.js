import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { ApiError } from "../utils/error.utils.js"
import { User } from "../models/user.models.js"
import { uploadOncloudinary } from "../utils/cloudinary.utils.js"
import jwt from "jsonwebtoken"
const accessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ valideBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError("Something went wrong while generating refresh token", 500);

    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, fullname } = req.body
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError("User already exists", 400)

    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError("Please upload avatar", 400)
    }
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError("Failed to upload avatar", 500)
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError("Failed to create user", 500)
    }
    return res.status(200).json(createdUser)


})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body
    if (!(email || username)) {
        throw new ApiError("Please provide email or username", 400)
    }
    const user = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        throw new ApiError("User not found", 404)
    }
    const isPasswordvalid = await user.comparePassword(password)

    if (!isPasswordvalid) {
        throw new ApiError("Invalid credentials", 401)
    }
    const { accessToken, refreshToken } = await accessAndRefreshToken(user._id)
    const loggedInuser = await User.findById(user._id).select("-password -refreshToken")
    const option = {
        httpOnly: true,
        secure: true
    }
    res.cookie("accessToken", accessToken, option)
    res.cookie("refreshToken", refreshToken, option)
    return res.status(200).json(loggedInuser, accessToken, refreshToken)
})
const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate({ _id: req.user._id },
        {
            $unset: {
                refreshToken: 1
            }

        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json({
        message: "logged out successfully"
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError("No refresh token provided", 401)
    }
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
    if (!user) {
        throw new ApiError("User not found", 404)
    }
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(" refresh token is expired", 401)
    }
    const option = {
        httpOnly: true,
        secure: true
    }
    const { accessToken, refreshToken } = await accessAndRefreshToken(user._id)
    return res.status(200).cookie("accessToken", accessToken,option).cookie("refreshToken",refreshToken,option).json("acessToken refreshed")
})
export { registerUser, loginUser, logOutUser,refreshAccessToken }