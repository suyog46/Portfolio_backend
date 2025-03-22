import mongoose from "mongoose";

const connectDb=async()=>{
   
try {
    const connect=await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`)
    console.log("database connected succesfully")
    }
    catch (error) {
        console.log("error in connecting to db",error.message)
        process.exit()
    }
} 

export default connectDb
