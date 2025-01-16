const mongoose = require("mongoose");

/**
 * Food schema for storing details of food items in the system.
 *
 * This schema captures all the necessary details about a food item, such as its title, category, availability,
 * description, price, additives, and location. It also stores restaurant information and ratings for the food item.
 *
 * @property {string} title - The title or name of the food item (required).
 * @property {Array} foodTags - Tags related to the food item for categorization (required).
 * @property {string} category - The category of the food (e.g., starter, main course, dessert) (required).
 * @property {Array} foodType - The types of food, such as vegetarian, non-vegetarian, etc. (required).
 * @property {string} code - The unique code associated with the food item (required).
 * @property {boolean} isAvailable - Indicates if the food item is currently available (default: true).
 * @property {ObjectId} restaurant - The reference to the Restaurant model, indicating where the food item is available (optional).
 * @property {number} rating - The average rating for the food item (optional, between 1 and 5).
 * @property {string} ratingCount - The number of ratings the food item has received (optional).
 * @property {number} distance - The distance of the restaurant (optional).
 * @property {string} description - A description of the food item (required).
 * @property {number} price - The price of the food item (required).
 * @property {Array} additives - A list of additives available for the food item (required).
 * @property {Array} imageUrl - An array of URLs representing images of the food item (required).
 * @property {Object} location - The location of the restaurant offering the food item, stored as geographic coordinates.
 * @property {string} location.type - The type of location data (default: "Point").
 * @property {Array} location.coordinates - The geographical coordinates [longitude, latitude] of the restaurant (required).
 */
const foodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  foodTags: { type: Array, required: true },
  category: { type: String, required: true },
  foodType: { type: Array, required: true },
  code: { type: String, required: true },
  isAvailable: { type: Boolean, required: true, default: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  ratingCount: { type: String },
  distance: { type: Number },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  additives: { type: Array, required: true },
  imageUrl: { type: Array, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

// Indexing the location coordinates for efficient geospatial queries
foodSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Food", foodSchema);
