import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import userModel from "../model/user.model.js";
import { sendFeedbackEmail } from "../utils/sendMail"; 




export const handleuser=asyncHandler(async(req,res)=>{

    console.log("data is",req.body);
    const {userName,userEmail,userFeedback}=req.body;



if(!userName| !userEmail |!userFeedback){
    throw new ApiError(404,"username or email or Feedback cannot be empty")
}
const user=await userModel.create({
    userName:userName,
    email:userEmail,
    feedback:userFeedback
})
if(!user){
    throw new ApiError(400,"there was error while pushing the data to the db")
}

await sendFeedbackEmail({
    name: userName,
    email: userEmail,
    message: userFeedback,
  });

return res.
status(200).
json( new ApiResponse(201,{},"data pushed to db succesfully!"))
})
