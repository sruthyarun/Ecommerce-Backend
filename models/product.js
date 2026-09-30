const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"]
        },

        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
            min: [0, "Quantity cannot be negative"],
            default: 0
        },

        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);