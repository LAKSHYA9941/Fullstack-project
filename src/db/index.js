import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";
const app = express();

const connectDB = async () => {
    try {
        const connectionINST = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // console.log(`MongoDB Connected: ${connectionINST.connection.host}`)
        app.listen(process.env.PORT ||3000, () => {
            console.log(`Server is running on port: ${process.env.PORT ||3000}`)
        })
    } catch (error) {
        console.log(`ERROR: ${error}`)
        process.exit(1)
    }
}

export default connectDB