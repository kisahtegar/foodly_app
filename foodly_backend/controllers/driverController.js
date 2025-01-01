const Driver = require("../models/Driver");
const User = require("../models/User");
const mongoose = require("mongoose");

const DEFAULT_LATITUDE = -6.159198355226237; // Default latitude (Jalan Villa Tomang Baru, Kuta Baru 11513, Banten, Indonesia)
const DEFAULT_LONGITUDE = 106.58317829811847;

module.exports = {
  /**
   * Registers a user as a driver by creating a Driver record and updating the user's role.
   *
   * This function is responsible for registering a user as a driver. It creates a new `Driver` document in the database
   * with details such as vehicle type, vehicle number, and current location. Additionally, it updates the user's
   * role to "Driver" in the `User` model and marks them as verified.
   *
   * @param {Object} req - The HTTP request object containing the user's data.
   * @param {Object} req.body - The request body containing driver details.
   * @param {string} req.body.vehicleType - The type of the vehicle (e.g., Car, Motorcycle).
   * @param {string} req.body.vehicleNumber - The vehicle's registration number.
   * @param {number} [req.body.latitude] - The driver's current latitude. Defaults to a predefined value if not provided.
   * @param {number} [req.body.longitude] - The driver's current longitude. Defaults to a predefined value if not provided.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating the status of the operation, along with the created driver data if successful.
   */
  registerDriver: async (req, res) => {
    const { vehicleType, vehicleNumber, latitude, longitude } = req.body;

    // Use default coordinates if latitude/longitude are not provided
    const validatedLatitude =
      latitude !== undefined ? latitude : DEFAULT_LATITUDE;
    const validatedLongitude =
      longitude !== undefined ? longitude : DEFAULT_LONGITUDE;

    const driverData = {
      driver: req.user.id, // User ID assumed to be present in req.user
      vehicleType,
      vehicleNumber,
      currentLocation: {
        latitude: validatedLatitude,
        longitude: validatedLongitude,
      },
      verification: "Verified",
    };

    // Start a MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create a new driver document
      const driver = new Driver(driverData);
      await driver.save({ session });

      // Update the user document to mark as Driver
      await User.findByIdAndUpdate(
        req.user.id,
        { userType: "Driver", verified: "true" },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        status: true,
        message: "Driver registered successfully",
        data: driver,
      });
    } catch (error) {
      // Abort transaction in case of an error
      await session.abortTransaction();
      session.endSession();

      res.status(500).json({
        status: false,
        message: "Failed to register driver",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves the details of a driver by their ID.
   *
   * This function fetches the details of a driver based on the provided driver ID.
   * It queries the `Driver` model and populates the associated `driver` field with additional user details.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the driver to retrieve.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with the driver's details if found, or an error message if not found.
   */
  getDriverDetails: async (req, res) => {
    const driverId = req.params.id;

    try {
      // Query the database for the driver with the specified ID
      const driver = await Driver.find({ driver: driverId }).populate("driver");
      if (driver) {
        res.status(200).json({ status: true, data: driver });
      } else {
        res.status(404).json({ status: false, message: "Driver not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to retrieve driver details",
        error: error.message,
      });
    }
  },

  /**
   * Updates the details of a driver by their ID.
   *
   * This function allows updating the driver's details based on the provided driver ID and
   * the request body containing the updated data. It uses the `Driver` model to perform the update operation.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the driver to update.
   * @param {Object} req.body - The data containing the updated driver details.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating success or failure.
   */
  updateDriverDetails: async (req, res) => {
    const driverId = req.params.id;

    try {
      const updatedDriver = await Driver.findByIdAndUpdate(driverId, req.body, {
        new: true,
      });

      if (updatedDriver) {
        res.status(200).json({
          status: true,
          message: "Driver details updated successfully",
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Driver not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to update driver details",
        error: error.message,
      });
    }
  },

  /**
   * Deletes a driver by their ID.
   *
   * This function removes a driver record from the database based on the provided driver ID.
   * It uses the `Driver` model to perform the delete operation.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the driver to delete.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating the result of the delete operation.
   */
  deleteDriver: async (req, res) => {
    const driverId = req.params.id;

    try {
      await Driver.findByIdAndDelete(driverId);

      res.status(200).json({
        status: true,
        message: "Driver deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to delete driver",
        error: error.message,
      });
    }
  },

  /**
   * Toggles the availability status of a driver.
   *
   * This function retrieves a driver's record by their ID, toggles their availability status
   * (e.g., from available to unavailable or vice versa), and saves the updated record in the database.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the driver whose availability status needs to be toggled.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating the updated availability status of the driver.
   */
  setDriverAvailability: async (req, res) => {
    const driverId = req.params.id;

    try {
      const driver = await Driver.findById(driverId);

      if (!driver) {
        res.status(404).json({ status: false, message: "Driver not found" });
        return;
      }

      // Toggle the driver's availability status
      driver.isAvailable = !driver.isAvailable;
      await driver.save();

      // Respond with the updated driver information
      res.status(200).json({
        status: true,
        message: `Driver is now ${
          driver.isAvailable ? "available" : "unavailable"
        }`,
        data: driver,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to update driver availability.",
        error: error.message,
      });
    }
  },
};
