import dotenv from "dotenv"
import main from "./db/server.js";
import { app } from "./app.js"

dotenv.config()

main()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running on port ${process.env.PORT || 4001}`);
        })

    }).catch((err) => {
        console.log(err);

    })