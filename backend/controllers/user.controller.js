import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { get } from "http";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// User registration controller
export const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing", success: false });
    }

    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields", success: false });
    }
const file=req.file;
const fileUri=getDataUri(file);
const cloudResponse=await cloudinary.uploader.upload(fileUri.content);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile:{
        profilePhoto:cloudResponse.secure_url,
      }
    });

    return res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// User login controller
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch", success: false });
    }

    const tokenData = { userId: user._id };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullname}`, success: true, user });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// User logout controller
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Profile update controller
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    // console.log(fullname, email, phoneNumber, bio, skills);
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    console.log(cloudResponse);

    
    //Cloundinary logic can be added here to upload the resume file if needed.

    let skillsArray;
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
      } catch {
        skillsArray = skills.split(",");
      }
    }

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      console.error("Request body:", req.body);
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if(cloudResponse){
      user.profile.resume = cloudResponse.secure_url; // Update resume URL if a new file is uploaded
      user.profile.resumeOriginalName = file.originalname; // Update avatar URL if a new file is uploaded
    }

    await user.save();

    const responseUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: responseUser,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};