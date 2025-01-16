const mongoose = require("mongoose");

/**
 * Cart schema for storing user's cart details.
 *
 * This model contains information about the user's cart, including the products added,
 * the quantity, additives, and total price.
 *
 * @property {ObjectId} userId - Reference to the user who owns the cart.
 * @property {ObjectId} productId - Reference to the food item added to the cart.
 * @property {Array} additives - List of additional items or modifications for the food.
 * @property {string} instructions - Special instructions for the food item (default is an empty string).
 * @property {number} quantity - Quantity of the food item in the cart (default is 1).
 * @property {number} totalPrice - Total price of the cart (required).
 */
const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    additives: { type: [] },
    instructions: { type: String, default: "" },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
