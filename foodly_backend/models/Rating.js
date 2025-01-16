const mongoose = require("mongoose");

/**
 * Rating schema for storing user ratings for restaurants.
 *
 * This model stores the ratings given by users to restaurants, including the rating
 * value and associated restaurant and user.
 *
 * @property {string} userId - The ID of the user who gave the rating (required).
 * @property {string} restaurantId - The ID of the restaurant being rated (required).
 * @property {number} rating - The rating value, between 1 and 5.
 */
const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
