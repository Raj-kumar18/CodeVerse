import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../config/cloudinary.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res, next) => {
    const { userName, email, password, phone, role } = req.body

    if (
        [userName, email, password, phone, role].some(field => field.trim() === "")
    ) {
        throw new ApiError(400, "Please provide all the required fields")
    }

    const userExists = await User.findOne({
        $or: [{ email }, { phone }]
    })

    if (userExists) {
        throw new ApiError(400, "User already exists")
    }

    const avatarLocalPath = req.file?.path; // ✅ Correct


    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide an avatar")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(500, "Something went wrong while uploading avatar")
    }

    const user = await User.create({
        userName,
        email,
        password,
        phone,
        role,
        avatar: avatar.url,
        isVerified: false, // ✅ Default false
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    // Generate OTP
    user.generateOTP();
    await user.save();

    // Send OTP Email
    await sendEmail(user.email, "Verify your account", `Your OTP is: ${user.otp}. It will expire in 5 minutes.`);

    return res.status(201).json(
        new ApiResponse(201, { email: user.email }, "User registered successfully. Please verify OTP.")
    );
})



const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        return res.status(400).json(new ApiResponse(400, null, "User already verified"));
    }

    const isValidOTP = user.verifyOTP(otp);
    if (!isValidOTP) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    await user.save();

    return res.json(new ApiResponse(200, null, "OTP verified successfully, account activated"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;

    if (!userName && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // ✅ **Check if user is verified via OTP**
    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your account first.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});


export { registerUser, verifyOTP, loginUser }