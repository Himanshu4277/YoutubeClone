import { Router } from "express";
import { loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controllers.js";
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

export default router