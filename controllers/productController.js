const Product = require("../models/product");

// ==========================
// Create Product
// ==========================
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            quantity,
            image
        } = req.body;

        // Required field validation
        if (
            !name ||
            !description ||
            !category ||
            price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, description, category, price and quantity are required"
            });
        }

        // Number validation
        if (price < 0 || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Price and quantity cannot be negative"
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            price,
            quantity,
            image: image || ""
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};


// ==========================
// Get All Products
// ==========================
const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort
        } = req.query;

        const filter = {};

        // Search by product name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        // Price filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Sorting
        let sortOption = {};

        if (sort === "price") {
            sortOption.price = 1;
        }

        if (sort === "-price") {
            sortOption.price = -1;
        }

        if (sort === "name") {
            sortOption.name = 1;
        }

        if (sort === "-name") {
            sortOption.name = -1;
        }

        const products = await Product.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


// ==========================
// Get Product By ID
// ==========================
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
};


// ==========================
// Update Product
// ==========================
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            quantity,
            image
        } = req.body;

        if (price !== undefined && price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...(name !== undefined && { name: name.trim() }),
                ...(description !== undefined && {
                    description: description.trim()
                }),
                ...(category !== undefined && {
                    category: category.trim()
                }),
                ...(price !== undefined && { price }),
                ...(quantity !== undefined && { quantity }),
                ...(image !== undefined && { image })
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};


// ==========================
// Delete Product
// ==========================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};