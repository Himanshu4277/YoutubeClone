import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
dotenv.config()
const MONGO_URI = process.env.MONGO_URI;
async function connectDBase() {
    try {
        const connectDB = await mongoose.connect(`mongodb+srv://Himanshu4277:x0qxX25lQ91hcZSc@himanshu.w0t8l.mongodb.net/${DB_NAME}`)
        console.log(`${connectDB.connection.host}`);

    } catch (error) {
        console.error(error.message);

    }

}
export default connectDBase