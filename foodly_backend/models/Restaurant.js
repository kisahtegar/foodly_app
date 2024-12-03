const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    foods: { type: Array },
    pickup: { type: Boolean, required: false, default: true },
    delivery: { type: Boolean, required: false, default: true },
    owner: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    code: { type: String, required: true },
    logoUrl: {
      type: String,
      required: true,
      default:
        "https://d326fntlu7tb1e.cloudfront.net/uploads/bdec9d7d-0544-4fc4-823d-3b898f6dbbbf-vinci_03.jpeg",
    },
    rating: { type: Number, min: 1, max: 5 },
    ratingCount: { type: String },
    coords: {
      id: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      latitudeDelta: { type: Number, required: true, default: 0.0122 },
      longitudeDelta: { type: Number, required: true, default: 0.0221 },
      address: { type: String, required: true },
      title: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
