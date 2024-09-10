import dotenv from "dotenv"
import connectDBase from "./db/server.js";
import { app } from "./app.js"

dotenv.config()

connectDBase()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running on port ${process.env.PORT || 4000}`);
        })

    }).catch((err) => {
        console.log(err);
        process.exit(1)

    })