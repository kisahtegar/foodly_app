const mongoose = require("mongoose");

/**
 * Address schema for storing user address details.
 *
 * This schema represents the address details of a user, including both their physical
 * address and any additional instructions for delivery. The address is linked to a
 * specific user through the `userId`, and it includes fields such as latitude, longitude,
 * and postal code. Users can have multiple addresses, but one can be marked as the default
 * address for easier selection during checkout.
 *
 * @property {string} userId - The ID of the user this address belongs to (required).
 * @property {string} addressLine1 - The first line of the address (required).
 * @property {string} postalCode - The postal code for the address (required).
 * @property {boolean} default - A flag to mark if this address is the default one for the user (default: false).
 * @property {string} deliveryInstructions - Any special instructions for the delivery (optional).
 * @property {number} latitude - The latitude coordinate for the address (required).
 * @property {number} longitude - The longitude coordinate for the address (required).
 */
const addressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    addressLine1: { type: String, required: true },
    postalCode: { type: String, required: true },
    default: { type: Boolean, default: false },
    deliveryInstructions: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Address", addressSchema);
