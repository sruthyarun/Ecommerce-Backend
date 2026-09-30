const express = require("express");

const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// Create order
router.post(
    "/",
    protect,
    authorize("user", "admin"),
    createOrder
);


// Get orders
router.get(
    "/",
    protect,
    authorize("user", "admin"),
    getOrders
);


// Get single order
router.get(
    "/:id",
    protect,
    authorize("user", "admin"),
    getOrderById
);


// Admin only
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateOrder
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteOrder
);


module.exports = router;