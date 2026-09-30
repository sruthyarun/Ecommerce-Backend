const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const {
    validateProduct
} = require("../middleware/validationMiddleware");


// Anyone can view products
router.get("/", getProducts);

router.get("/:id", getProductById);


// Admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    validateProduct,
    createProduct
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateProduct
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteProduct
);



module.exports = router;