const mongoose = require("mongoose");

/**
 * User schema for storing user details in the database.
 *
 * This model contains information about users, including authentication details, profile
 * information, and their role within the system.
 *
 * @property {string} username - The username of the user.
 * @property {string} email - The user's email address, which must be unique.
 * @property {string} uid - A unique identifier for the user.
 * @property {string} fcm - Firebase Cloud Messaging token for notifications (default is "none").
 * @property {string} otp - One-time password for user verification.
 * @property {boolean} verified - Indicates whether the user has verified their account.
 * @property {string} password - The user's password for authentication.
 * @property {Array} [address] - List of the user's addresses (optional).
 * @property {string} [phone] - The user's phone number (optional).
 * @property {string} userType - The user's role in the system (e.g., "Admin", "Driver", "Client", "Vendor").
 * @property {string} profile - URL of the user's profile picture (default is a placeholder image).
 */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    fcm: { type: String, required: true, default: "none" },
    otp: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    address: { type: Array, required: false },
    phone: { type: String, required: false },
    userType: {
      type: String,
      required: true,
      default: "Client",
      enum: ["Admin", "Driver", "Client", "Vendor"],
    },
    profile: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/dc7i32d3v/image/upload/v1732634011/samples/people/boy-snow-hoodie.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
