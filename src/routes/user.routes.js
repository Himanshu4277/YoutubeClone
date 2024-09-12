import { Router } from "express";
import { changePassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controllers.js";
const router = Router()
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

// router.post("/login",(req,res)=>{
//     registerUser(req,res)
// })
// or i can also write that way
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

  router.route("/login").post(loginUser);
  router.route("/logout").post(verifyJWT,logOutUser) 
  router.route("/refresh-token").post(refreshAccessToken) 
  router.route("/change-password").post(verifyJWT,changePassword)
  router.route("/current-user").post(verifyJWT,getCurrentUser)
  router.route("/update-account").patch(verifyJWT,updateAccountDetails)
  router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
  router.route("/cover-Image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
  router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
  router.route("/history").get(verifyJWT,getWatchHistory)
  
export default router