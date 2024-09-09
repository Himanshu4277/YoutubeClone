import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
dotenv.config()
const MONGO_URI = process.env.MONGO_URI;
async function main() {
    try {
        const connectDB = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`${connectDB.connection.host}`);

    } catch (error) {
        console.error(error.message);

    }

}
export default main