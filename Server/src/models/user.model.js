import { mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ["admin", "customer", "author", "user"], // "user" add kiya
      default: "user",
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], // Phone validation
    },
    refreshToken: {
      type: String,
    },

    // OTP Fields
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false, // Jab tak OTP verify nahi hota, false rahega
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

// ✅ **2️⃣ OTP Generate karne ka method**
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpires = Date.now() + 5 * 60 * 1000; // OTP 5 mins tak valid hoga
  return otp;
};

// ✅ **3️⃣ OTP Verify karne ka method**
userSchema.methods.verifyOTP = function (enteredOtp) {
  if (this.otp !== enteredOtp) return false;
  if (Date.now() > this.otpExpires) return false; // OTP expired
  this.otp = null; // OTP use hone ke baad hata diya
  this.otpExpires = null;
  this.isVerified = true; // User verify ho gaya
  return true;
};

// ✅ **4️⃣ JWT Token Generation**
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email,
      userName: this.userName,
      phone: this.phone,
      address: this.address,
      avatar: this.avatar,
      isVerified: this.isVerified,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const User = mongoose.model("User", userSchema);
