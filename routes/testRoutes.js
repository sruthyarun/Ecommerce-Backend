const express = require("express");

const router = express.Router();

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// Any logged-in user
router.get("/protected", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});


// Admin only
router.get(
    "/admin",
    protect,
    authorize("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin",
            user: req.user
        });
    }
);


// User only
router.get(
    "/user",
    protect,
    authorize("user"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome User",
            user: req.user
        });
    }
);


module.exports = router;