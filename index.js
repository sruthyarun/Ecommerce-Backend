const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const authenticationRoutes = require("./routes/authenticationRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/dbConnection");

const app = express();

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://ecommerce-frontend-iota-eight.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json({ limit: "10kb" }));

// MongoDB connection
connectDB();

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "E-Commerce Backend API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authenticationRoutes);

const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

const userProfileRoutes = require("./routes/userProfileRoutes");
app.use("/api/users", userProfileRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});