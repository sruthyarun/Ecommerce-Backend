const Order = require("../models/order");
const Product = require("../models/product");

// ==========================
// Create Order
// ==========================
const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one product"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        // Check every product
        for (const item of items) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must contain product and quantity"
                });
            }

            if (item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be at least 1"
                });
            }

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += itemTotal;
        }

        // Reduce stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        quantity: -item.quantity
                    }
                }
            );
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate("items.product", "name category price");

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};


// ==========================
// Get Orders
// ==========================
const getOrders = async (req, res) => {
    try {
        let filter = {};

        // Normal users see only their orders
        if (req.user.role === "user") {
            filter.user = req.user.id;
        }

        // Admin can see all orders
        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate("items.product", "name category price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// ==========================
// Get Order By ID
// ==========================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product", "name category price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // User can only view their own order
        if (
            req.user.role === "user" &&
            order.user._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only view your own orders"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid order ID"
        });
    }
};


// ==========================
// Update Order
// ==========================
const updateOrder = async (req, res) => {
    try {
        const {
            status,
            shippingAddress
        } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const updateData = {};

        if (status !== undefined) {
            updateData.status = status;
        }

        if (shippingAddress !== undefined) {
            updateData.shippingAddress = shippingAddress.trim();
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("user", "name email")
            .populate("items.product", "name category price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update order",
            error: error.message
        });
    }
};


// ==========================
// Delete Order
// ==========================
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid order ID"
        });
    }
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};