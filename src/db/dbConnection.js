import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n mongodb connected successfully !! DB HOST:${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB CONNECTION FAILD",error);
        process.exit(1);
    }
}