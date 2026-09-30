const Product = require("../models/product");

// ==========================
// Product Recommendations
// ==========================
const getRecommendations = async (req, res) => {
    try {
        const { category, price } = req.query;

        let filter = {};

        // Recommend products from the same category
        if (category) {
            filter.category = {
                $regex: category,
                $options: "i"
            };
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .limit(5);

        // If no category is supplied,
        // return recently added products
        if (!products.length) {
            const fallbackProducts = await Product.find()
                .sort({ createdAt: -1 })
                .limit(5);

            return res.status(200).json({
                success: true,
                message: "Recommended products",
                recommendations: fallbackProducts
            });
        }

        res.status(200).json({
            success: true,
            message: "Recommended products",
            basedOn: {
                category: category || null,
                price: price || null
            },
            recommendations: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate recommendations",
            error: error.message
        });
    }
};

module.exports = {
    getRecommendations
};