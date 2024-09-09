import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
const router = Router()

// router.post("/login",(req,res)=>{
//     registerUser(req,res)
// })
// or i can also write that way
router.route("/login").post(registerUser)
export default router