import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/error.utils.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
//you can use _ instead of res if not in use 
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError("Unauthorized: No token provided", 401)
        }
        const decodetoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodetoken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError("Unauthorized: User not found", 401)
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError("invalid Access token", 401)
    }
})