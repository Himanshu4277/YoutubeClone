import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
const router = Router()
import { upload } from "../middleware/multer.middleware.js"

// router.post("/login",(req,res)=>{
//     registerUser(req,res)
// })
// or i can also write that way
router.route("/login").post(
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
router.get("/log", (req, res) => {
    res.send("hello")
})
export default router