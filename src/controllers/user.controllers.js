import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { ApiError } from "../utils/error.utils.js"
import { User } from "../models/user.models.js"
import { uploadOncloudinary } from "../utils/cloudinary.utils.js"

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
    const avatar = uploadOncloudinary(avatarLocalPath)
    const coverImage = uploadOncloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError("Failed to upload avatar", 500)
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        username: username.toLowercase()
    })

   const createdUser=await User.findById(user._id).select("-password -refreshToken")
   if(!createdUser){
    throw new ApiError("Failed to create user", 500)
   }
   return res.status(200).json(createdUser)
})

export { registerUser }