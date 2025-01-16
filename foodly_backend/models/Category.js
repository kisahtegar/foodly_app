const mongoose = require("mongoose");

/**
 * Category schema for storing category details in the application.
 *
 * This schema captures the details about different categories of food, such as their name, value, and image.
 * Categories help in organizing food items into distinct groups for better search and filtering.
 *
 * @property {string} title - The title of the category (required).
 * @property {string} value - The unique identifier or value associated with the category (required).
 * @property {string} imageUrl - The URL of the image representing the category (required).
 */
const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Category", categorySchema);
