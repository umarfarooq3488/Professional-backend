import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// Connect to MongoDB

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Connected to MongoDB ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("ERROR: DB CONNECTION FAILED!!", error)
        process.exit(1)
    }
}

export default connectDB;