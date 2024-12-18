import mongoose from "mongoose"
import { MONGO_URI } from "./envs";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Database connected")
  } catch (error) {
    console.log("Database connection failed")
    console.log(error)
  }
}