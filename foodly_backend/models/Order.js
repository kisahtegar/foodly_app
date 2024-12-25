const mongoose = require("mongoose");

/**
 * Order item schema for storing individual food item details in an order.
 *
 * This schema captures the details of each food item in an order, including its quantity,
 * price, additives, and instructions.
 *
 * @property {ObjectId} foodId - The reference to the Food model (required).
 * @property {number} quantity - The quantity of the food item (required).
 * @property {number} price - The price of the food item (required).
 * @property {Array} additives - The list of additives applied to the food item.
 * @property {string} instructions - Special instructions for the food item (optional).
 * @property {string} title - The name/title of the food item (required).
 * @property {string} imageUrl - The image URL of the food item (required).
 * @property {string} time - The time when the food item was added (required).
 */
const orderItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  additives: [
    {
      id: Number, //or number
      title: String,
      price: String,
    },
  ],
  instructions: { type: String, default: "" },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  time: { type: String, required: true },
});

/**
 * Order schema for storing the details of a user’s order.
 *
 * This model stores the full details of a user’s order, including order items, status,
 * delivery address, and payment details.
 *
 * @property {ObjectId} userId - The reference to the User model (required).
 * @property {Array} orderItems - The list of items in the order (required).
 * @property {number} orderTotal - The total amount of the order (required).
 * @property {number} deliveryFee - The delivery fee for the order (required).
 * @property {number} grandTotal - The total amount after including delivery fee (required).
 * @property {ObjectId} deliveryAddress - The reference to the Address model for delivery (required).
 * @property {string} paymentMethod - The payment method used for the order (optional).
 * @property {string} paymentStatus - The current payment status of the order (default: "Pending").
 * @property {string} orderStatus - The current status of the order (default: "Placed").
 * @property {Date} orderDate - The date when the order was placed (default: current date).
 * @property {ObjectId} restaurantId - The reference to the Restaurant model (required).
 * @property {ObjectId} driverId - The reference to the Driver model (optional).
 * @property {number} rating - The user’s rating for the order (optional).
 * @property {string} feedback - User feedback for the order (optional).
 * @property {string} promoCode - The promo code used for the order (optional).
 * @property {number} discountAmount - The discount amount applied (optional).
 * @property {string} notes - Any additional notes for the order (optional).
 */
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    orderTotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentMethod: { type: String },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"],
    },
    orderStatus: {
      type: String,
      default: "Placed",
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered"],
    },
    orderDate: { type: Date, default: Date.now },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    promoCode: { type: String },
    discountAmount: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
