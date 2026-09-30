const express = require("express");

const router = express.Router();

const {
    getProfile,
    updateProfile,
    deleteProfile
} = require("../controllers/userProfile");

const { protect } = require("../middleware/authMiddleware");


// Get logged-in user's profile
router.get("/profile", protect, getProfile);


// Update logged-in user's profile
router.put("/profile", protect, updateProfile);


// Delete logged-in user's profile
router.delete("/profile", protect, deleteProfile);


module.exports = router;