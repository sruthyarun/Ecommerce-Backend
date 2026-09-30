const express = require("express");

const router = express.Router();

const {
    getRecommendations
} = require("../controllers/analyticsController");

const {
    protect
} = require("../middleware/authMiddleware");


// Logged-in users can get recommendations
router.get(
    "/recommendations",
    protect,
    getRecommendations
);

module.exports = router;