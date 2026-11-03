import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const userResponse = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  skills: user.skills,
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 60) {
      return res.status(400).json({
        message: "Name must be between 2 and 60 characters",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password must be between 8 and 72 characters",
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    user: userResponse(req.user),
  });
});

// PATCH /api/auth/profile
// Update logged-in user's profile
router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, bio, skills } = req.body ?? {};

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 60
      ) {
        return res.status(400).json({
          message: "Name must be between 2 and 60 characters",
        });
      }

      req.user.name = name.trim();
    }

    if (bio !== undefined) {
      if (typeof bio !== "string" || bio.length > 500) {
        return res.status(400).json({
          message: "Bio must be a string with maximum 500 characters",
        });
      }

      req.user.bio = bio.trim();
    }

    if (skills !== undefined) {
      if (
        !Array.isArray(skills) ||
        !skills.every(
          (skill) =>
            typeof skill === "string" &&
            skill.trim().length > 0 &&
            skill.trim().length <= 50
        )
      ) {
        return res.status(400).json({
          message: "Skills must be an array of valid strings",
        });
      }

      req.user.skills = [...new Set(
        skills.map((skill) => skill.trim())
      )];
    }

    await req.user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse(req.user),
    });
  } catch (error) {
    console.error("Profile update error:", error.message);

    return res.status(500).json({
      message: "Profile update failed",
    });
  }
});

export default router;