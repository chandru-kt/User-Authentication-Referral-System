require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null },
    referrals: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);

// Password Validation Function
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Generate JWT Token
function generateToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Register User
app.post("/api/register", async (req, res) => {
    const { username, email, password, referralCode } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({ message: "Weak password! Include uppercase, lowercase, number, special character, and min 8 chars." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                newUser.referredBy = referrer._id;  // Store the referrer’s ID
                referrer.referrals += 1;
                await referrer.save();
            }
        }

        newUser.referralCode = Math.random().toString(36).substring(2, 10);
        await newUser.save();

        res.status(201).json({ 
            message: "User registered successfully", 
            referralCode: newUser.referralCode,
            referralLink: `${process.env.FRONTEND_URL}/register?referral=${newUser.referralCode}`
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Login User
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(user.email);
        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Forget Password API
app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

        res.status(200).json({
            message: "Use this token to reset your password",
            resetToken: resetToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Reset Password API
app.post("/api/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "Invalid token or user not found" });

        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: "Weak password! Include uppercase, lowercase, number, special character, and min 8 chars." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token", error });
    }
});

// Get Users Referred by Logged-in User
app.get("/api/referrals", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const referredUsers = await User.find({ referredBy: user._id }).select("username email");
        res.status(200).json(referredUsers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get Referral Stats
app.get("/api/referral-stats", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "User not found" });

        res.status(200).json({ 
            username: user.username,
            totalReferrals: user.referrals
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
