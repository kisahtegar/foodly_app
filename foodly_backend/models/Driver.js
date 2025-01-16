const mongoose = require("mongoose");

/**
 * Driver schema for storing driver information and vehicle details.
 *
 * This schema captures details about drivers, including their vehicle information, current location, availability,
 * and rating. It also tracks the total number of deliveries made and includes driver profile details and verification status.
 *
 * @property {ObjectId} driver - The reference to the User model, representing the driver (required).
 * @property {string} vehicleType - The type of vehicle the driver uses, such as Bike, Scooter, or Car (required).
 * @property {string} vehicleNumber - The vehicle's number or license plate (required).
 * @property {Object} currentLocation - The current location of the driver, including latitude, longitude, and deltas for zoom control.
 * @property {number} currentLocation.latitude - The latitude of the driver's current location (required).
 * @property {number} currentLocation.longitude - The longitude of the driver's current location (required).
 * @property {number} currentLocation.latitudeDelta - The zoom level for latitude (default: 0.0122).
 * @property {number} currentLocation.longitudeDelta - The zoom level for longitude (default: 0.0221).
 * @property {boolean} isAvailable - Indicates if the driver is currently available for orders (default: true).
 * @property {number} rating - The average rating for the driver (between 1 and 5, default: 1).
 * @property {number} totalDeliveries - The total number of deliveries made by the driver (default: 0).
 * @property {string} profileImage - The URL of the driver's profile image (default to a placeholder image).
 * @property {boolean} isActive - Indicates if the driver is active on the platform (default: true).
 * @property {string} verification - The verification status of the driver (default: "Unverified").
 */
const driverSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicleType: {
      type: String,
      required: true,
      enum: ["Bike", "Scooter", "Car"],
    },
    vehicleNumber: { type: String, required: true },
    currentLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      latitudeDelta: { type: Number, required: true, default: 0.0122 },
      longitudeDelta: { type: Number, required: true, default: 0.0221 },
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, min: 1, max: 5, default: 1 }, // Updated to have a default value
    totalDeliveries: { type: Number, default: 0 },
    profileImage: {
      type: String,
      defalut:
        "https://d326fntlu7tb1e.cloudfront.net/uploads/bdec9d7d-0544-4fc4-823d-3b898f6dbbbf-vinci_03.jpeg",
    },
    isActive: { type: Boolean, default: true }, // To track if the driver is currently active on the platform
    verification: { type: String, default: "Unverified" }, // Added verification field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
