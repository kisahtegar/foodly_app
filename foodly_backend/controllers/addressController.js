const Address = require("../models/Address");

module.exports = {
  /**
   * Create a new address for a user.
   *
   * This function creates a new address, saves it to the database, and ensures that
   * only one address is set as the default for the user. If a default address is
   * provided, other addresses for the user are updated to not be default.
   *
   * @param {Object} req - The request object containing the user's address details.
   * @param {Object} res - The response object that will be sent back to the client.
   * @returns {Object} - The created address object, or a message indicating the status of the operation.
   */
  createAddress: async (req, res) => {
    // Validate required fields
    const {
      addressLine1,
      postalCode,
      deliveryInstructions,
      default: isDefault,
      latitude,
      longitude,
    } = req.body;

    if (!addressLine1 || !postalCode) {
      return res.status(400).json({
        status: false,
        message: "Address Line 1 and Postal Code are required.",
      });
    }

    const address = new Address({
      userId: req.user.id,
      addressLine1,
      postalCode,
      deliveryInstructions,
      default: isDefault,
      latitude,
      longitude,
    });

    try {
      if (isDefault) {
        // Set all other addresses for the user as non-default before saving the new address
        await Address.updateMany({ userId: req.user.id }, { default: false });
      }

      // Save the address
      const savedAddress = await address.save();

      // If the saved address is set as default, return it, else return the default address if available
      if (savedAddress.default) {
        return res.status(201).json(savedAddress);
      } else {
        const defaultAddress = await Address.findOne({
          userId: req.user.id,
          default: true,
        });
        if (!defaultAddress) {
          return res
            .status(200)
            .json({ status: false, message: "No default address found." });
        }
        return res.status(201).json(defaultAddress);
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  /**
   * Delete a specific address by its ID.
   *
   * This function attempts to delete an address from the database. If the address is
   * found and is set as the default address, it will try to set another address as
   * the default (if available). If no other address is available, it will remove the
   * default flag from all the user's addresses. The function returns a success message
   * if the address is deleted successfully, or an error message if any issues arise
   * during the process.
   *
   * @param {Object} req - The request object containing the address ID as a parameter.
   * @param {Object} res - The response object to send the result or error message.
   *
   * @returns {Object} - The result object containing the status and a message about the deletion.
   */
  deleteAddress: async (req, res) => {
    const addressId = req.params.id;

    try {
      // Find the address by its ID
      const address = await Address.findById(addressId);

      if (!address) {
        // Return a 404 if the address is not found
        return res
          .status(404)
          .json({ status: false, message: "Address not found" });
      }

      // Check if the address is set as the default
      if (address.default) {
        // If the address is default, set another address as default, if available
        const newDefaultAddress = await Address.findOne({
          userId: address.userId,
          default: { $ne: addressId },
        });

        if (newDefaultAddress) {
          await Address.findByIdAndUpdate(newDefaultAddress._id, {
            default: true,
          });
        } else {
          // If no other address is available, we may want to reset the default to null
          await Address.updateMany(
            { userId: address.userId },
            { default: false }
          );
        }
      }

      // Delete the address
      await Address.findByIdAndDelete(addressId);
      res
        .status(200)
        .json({ status: true, message: "Address deleted successfully" });
    } catch (error) {
      // Log detailed error information in the response for debugging
      console.error("Error deleting address:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error. Please try again later.",
      });
    }
  },

  /**
   * Retrieve the default address of the currently authenticated user.
   *
   * This function searches the database for the default address of the authenticated
   * user based on the `userId` stored in the request. If a default address is found,
   * it returns the address. If no default address is set, it will return a `null`
   * response. If an error occurs during the database query, it sends an appropriate
   * error message to the client.
   *
   * @param {Object} req - The request object containing the user ID (from `req.user.id`) for the currently authenticated user.
   * @param {Object} res - The response object to send the result or error message.
   *
   * @returns {Object} - The result object containing the status and the user's default address (if found).
   */
  getDefaultAddress: async (req, res) => {
    const userId = req.user.id;

    try {
      // Look for the user's default address in the database
      const defaultAddress = await Address.findOne({ userId, default: true });

      if (!defaultAddress) {
        return res
          .status(404)
          .json({ status: false, message: "No default address found" });
      }

      res.status(200).json(defaultAddress);
    } catch (error) {
      // Log the error and send a generic error message
      console.error("Error retrieving default address:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error. Please try again later.",
      });
    }
  },

  /**
   * Retrieve all addresses associated with the currently authenticated user.
   *
   * This function queries the database to find all addresses linked to the authenticated
   * user using the `userId` stored in the request. It returns all the addresses that
   * belong to the user. If an error occurs during the database query, it sends an
   * appropriate error message to the client.
   *
   * @param {Object} req - The request object containing the user ID (from `req.user.id`) for the currently authenticated user.
   * @param {Object} res - The response object to send the result or error message.
   *
   * @returns {Array} - An array of addresses associated with the user, or an error message in case of failure.
   */
  getUserAddresses: async (req, res) => {
    const userId = req.user.id;

    try {
      // Find all addresses associated with the user
      const addresses = await Address.find({ userId });

      if (!addresses || addresses.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No addresses found for this user.",
        });
      }

      res.status(200).json(addresses);
    } catch (error) {
      // Log the error and send a generic error message
      console.error("Error retrieving user addresses:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error. Please try again later.",
      });
    }
  },

  /**
   * Update an existing address for the currently authenticated user.
   *
   * This function allows updating the details of an existing address, including its
   * line, postal code, latitude, longitude, etc. If the address is marked as default,
   * it ensures that no other address is set as the default for the user before
   * performing the update. It returns a success message if the update is successful
   * or an error message if something goes wrong.
   *
   * @param {Object} req - The request object containing the address ID (from `req.params.id`) and the updated address details (from `req.body`).
   * @param {Object} res - The response object to send the result or error message.
   *
   * @returns {Object} - A success message or an error message based on the outcome of the update operation.
   */
  updateAddress: async (req, res) => {
    const addressId = req.params.id;

    try {
      // If the request marks the address as default, ensure no other address is set as default for this user
      if (req.body.default === true) {
        await Address.updateMany(
          { userId: req.body.userId },
          { default: false }
        );
      }

      // Update the address with the provided details
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        req.body,
        { new: true }
      );

      if (!updatedAddress) {
        return res
          .status(404)
          .json({ status: false, message: "Address not found" });
      }

      // Return success response with the updated address data
      res.status(200).json({
        status: true,
        message: "Address updated successfully",
        updatedAddress,
      });
    } catch (error) {
      // Log the error for debugging purposes and send a generic error message
      console.error("Error updating address:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error. Please try again later.",
      });
    }
  },

  /**
   * Set a specific address as the default address for the currently authenticated user.
   *
   * This function sets the specified address as the default address for the user. It
   * first updates all the user's addresses to set the `default` field to `false`, ensuring
   * that no other address is marked as default. Then, it updates the specified address to
   * be the default. It returns the updated address if the operation is successful or an error
   * message if something goes wrong.
   *
   * @param {Object} req - The request object containing the address ID (from `req.params.address`) and the user ID (from `req.user.id`).
   * @param {Object} res - The response object to send the result or error message.
   *
   * @returns {Object} - The updated address object if the operation is successful or an error message if the address is not found.
   */
  setDefaultAddress: async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.address;

    try {
      // Set all addresses for this user to non-default
      await Address.updateMany({ userId: userId }, { default: false });

      // Now set the specified address as default
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { default: true },
        { new: true }
      );

      if (!updatedAddress) {
        return res
          .status(404)
          .json({ status: false, message: "Address not found" });
      }

      // Return the updated address as the default address
      res.status(200).json(updatedAddress);
    } catch (error) {
      // Log the error and send a generic error message to avoid exposing sensitive details
      console.error("Error setting default address:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error. Please try again later.",
      });
    }
  },
};
