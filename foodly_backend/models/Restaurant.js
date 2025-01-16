const mongoose = require("mongoose");

/**
 * Restaurant schema for storing restaurant details.
 *
 * This model stores information about a restaurant, including its name, owner, services, location, and rating.
 *
 * @property {string} title - Name of the restaurant (required).
 * @property {string} time - Operating hours of the restaurant (required).
 * @property {string} imageUrl - URL to the restaurant's image (required).
 * @property {Array} foods - List of food items available at the restaurant.
 * @property {boolean} pickup - Availability of pickup service (default is true).
 * @property {boolean} delivery - Availability of delivery service (default is true).
 * @property {string} owner - ID or name of the restaurant owner (required).
 * @property {boolean} isAvailable - Whether the restaurant is currently available for service (default is true).
 * @property {string} verification - Verification status of the restaurant (default is "Pending").
 * @property {string} verificationMessage - Message displayed with the verification status.
 * @property {string} code - Unique code for the restaurant (required).
 * @property {string} logoUrl - URL to the restaurant's logo (required).
 * @property {number} rating - Average rating of the restaurant (default is 1, range 1-5).
 * @property {string} ratingCount - Total number of ratings.
 * @property {string} distance - Distance from the user or a reference point.
 * @property {Object} location - GeoJSON point for the restaurant's location, used for location-based queries.
 * @property {Object} coords - Detailed coordinates for the restaurant's location, including latitude, longitude, and address.
 */
const restaurantSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    foods: { type: Array },
    pickup: { type: Boolean, required: true, default: true },
    delivery: { type: Boolean, required: true, default: true },
    owner: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    verification: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Verified", "Rejected"],
    },
    verificationMessage: {
      type: String,
      default:
        "Please allow up to 24 hours for your verification to be processed. You will receive a notification once your verification is complete.",
    },
    code: { type: String, required: true },
    logoUrl: { type: String, required: true },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    ratingCount: { type: String },
    distance: { type: String },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    coords: {
      id: { type: String },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      latitudeDelta: { type: Number, default: 0.0122 },
      longitudeDelta: { type: Number, default: 0.0221 },
      address: { type: String, required: true },
      title: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Create 2dsphere index for location-based queries
restaurantSchema.index({ "location.coordinates": "2dsphere" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
