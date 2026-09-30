const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ==========================
// Get User Profile
// ==========================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};


// ==========================
// Update User Profile
// ==========================
const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update name
        if (name) {
            user.name = name.trim();
        }

        // Update email
        if (email) {
            const existingUser = await User.findOne({
                email: email.toLowerCase(),
                _id: { $ne: req.user.id }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            user.email = email.toLowerCase().trim();
        }

        // Update password
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters"
                });
            }

            user.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};


// ==========================
// Delete User Profile
// ==========================
const deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User account deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    deleteProfile
};