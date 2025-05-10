import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import userModel from "../model/user.model.js";
import { sendFeedbackEmail } from "../utils/sendMail.js";
import axios from "axios";

export const handleuser = asyncHandler(async (req, res) => {
    const { userName, userEmail, userFeedback, token } = req.body;

    // Validate required fields
    if (!userName || !userFeedback || !token) {
        throw new ApiError(400, "Name, message, and CAPTCHA token are required");
    }

    // Email is optional but if provided, should be valid
    if (userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Verify reCAPTCHA token
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            throw new ApiError(500, "Server configuration error");
        }

        const googleResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            new URLSearchParams({
                secret: secretKey,
                response: token,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { success, score, action } = googleResponse.data;

        if (!success || score < 0.5) {
            console.warn(`reCAPTCHA verification failed. Score: ${score}, Action: ${action}`);
            throw new ApiError(403, "Failed CAPTCHA verification. Please try again.");
        }
        else{
            console.log("verified successfully!")
        }
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        throw new ApiError(500, "Error verifying CAPTCHA");
    }

    // Create user feedback record
    try {
        const user = await userModel.create({
            userName: userName,
            email: userEmail || null, // Store as null if not provided
            feedback: userFeedback
        });

        // Send email notification (don't await to speed up response)
        if (userEmail) {
            sendFeedbackEmail({
                name: userName,
                email: userEmail,
                message: userFeedback,
            }).catch(err => console.error("Error sending email:", err));
        }

        return res
            .status(200)
            .json(new ApiResponse(201, {}, "Feedback submitted successfully!"));
    } catch (dbError) {
        console.error("Database error:", dbError);
        throw new ApiError(500, "Error saving your feedback. Please try again.");
    }
});