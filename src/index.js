import dotenv from "dotenv"
import connectDB from "./db/DB.js";

dotenv.config({
    path: "../.env"
});

connectDB();