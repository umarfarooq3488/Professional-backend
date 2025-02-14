import dotenv from "dotenv"
import connectDB from "./db/DB.js";
import { app } from "./app.js";

dotenv.config({
    path: "../.env"
});

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.error("Server Error", err.message);
            process.exit(1);
        })
        app.listen(`${process.env.PORT}`, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch(error => {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    })