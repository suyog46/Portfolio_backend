import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import userModel from "../model/user.model.js";
import { sendFeedbackEmail } from "../utils/sendMail.js";
import axios from "axios";



export const handleuser=asyncHandler(async(req,res)=>{

    console.log("data is",req.body);
    const {userName,userEmail,userFeedback,token}=req.body;



if(!userName|| !userEmail ||!userFeedback || !token){
    throw new ApiError(404,"Missing required fields or CAPTCHA token")
}

  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Add this to your .env file
  const googleResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
  );

  const { success, score, action } = googleResponse.data;

  if (!success || score < 0.5) {
    throw new ApiError(403, "Failed CAPTCHA verification");
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
