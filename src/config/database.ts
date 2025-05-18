import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        const uri = process.env.MONGO_URL || "mongodb://localhost:27017/text_analyzer_db";
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}