import mongoose from "mongoose";


const userSchema=mongoose.Schema({
    userName:{
        type: String,
        required:true,
        lowercase:true,
    },
    email:{
            type:String,
            // required:true,
            lowercase:true,
    },
    feedback:{
        type:String,
        required:true,
    }
},
{timestamps:true});

const userModel=mongoose.model("user",userSchema);
export default userModel;