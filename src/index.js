import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path: ".env"
})

connectDB()






























/*
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on((error) => {
            console.log(`ERROR: ${error}`)

            throw error

        })

        app.listen( process.env.PORT || 3000, () => {
            console.log("Server is running on port ",process.env.PORT || 3000)
        })


    } catch (error) {
        console.log(`ERROR: ${error}`)
        throw error


    }
})()
    */