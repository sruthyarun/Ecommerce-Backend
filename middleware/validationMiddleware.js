const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


// Validate registration
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    next();
};


// Validate login
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }

    next();
};


// Validate product
const validateProduct = (req, res, next) => {
    const {
        name,
        description,
        category,
        price,
        quantity
    } = req.body;

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

    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be a valid non-negative number"
        });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a non-negative integer"
        });
    }

    next();
};


module.exports = {
    validateRegister,
    validateLogin,
    validateProduct
};