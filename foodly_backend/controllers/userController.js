const User = require("../models/User");
const admin = require("firebase-admin");

module.exports = {
  /**
   * Updates the information of the currently authenticated user.
   *
   * This function allows updating user fields such as email, name, and password.
   * If a new password is provided, it encrypts the password before updating.
   * The updated user data, excluding sensitive fields, is returned in the response.
   *
   * @param {Object} req - The request object.
   * @param {string} req.user.id - The ID of the authenticated user.
   * @param {Object} req.body - The data to update in the user's record.
   * @param {string} [req.body.password] - Optional. A new password to be encrypted and saved.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response containing the updated user data or an error message.
   */
  updateUser: async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      const { password, __v, createdAt, ...others } = updatedUser._doc;

      res.status(200).json({ ...others });
    } catch (err) {
      console.error(
        "[userController.updateUser]: Error updating user = ",
        err.message
      );
      res.status(500).json({
        status: false,
        message: "Failed to update user",
        error: err.message,
      });
    }
  },

  /**
   * Deletes the currently authenticated user's account.
   *
   * This function removes the user record from the database based on the authenticated user's ID.
   * A success message is sent in the response upon successful deletion.
   *
   * @param {Object} req - The request object.
   * @param {string} req.user.id - The ID of the authenticated user to be deleted.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response with a success message or an error message.
   */
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json("Successfully Deleted");
    } catch (error) {
      console.error(
        "[userController.deleteUser]: Error deleting user = ",
        error.message
      );
      res.status(500).json({
        status: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves the currently authenticated user's information.
   *
   * This function fetches the user record from the database based on the authenticated user's ID
   * and excludes sensitive fields such as `password`, `__v`, and `createdAt` from the response.
   *
   * @param {Object} req - The request object.
   * @param {string} req.user.id - The ID of the authenticated user.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response containing the user's data, excluding sensitive fields.
   */
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const { password, __v, createdAt, ...userdata } = user._doc;
      res.status(200).json(userdata);
    } catch (error) {
      console.error(
        "[userController.getUser]: Error fetching user = ",
        error.message
      );
      res.status(500).json({
        status: false,
        message: "Failed to retrieve user details",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a list of all users from the database.
   *
   * This function fetches all user records from the database and sends them in the response.
   * No fields are excluded from the returned data.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response containing an array of all user records.
   */
  getAllUsers: async (req, res) => {
    try {
      const allUser = await User.find();
      res.status(200).json(allUser);
    } catch (error) {
      // If an error occurs, return a 500 status with an error message
      console.error(
        "[userController.getAllUsers]: Error fetching users = ",
        error.message
      );
      res.status(500).json({
        status: false,
        message: "Failed to retrieve users",
        error: error.message,
      });
    }
  },

  /**
   * Verifies a user's account using a provided OTP (One-Time Password).
   *
   * This function checks whether the provided OTP matches the one associated with the user's account.
   * If the OTP is valid, the user's account is marked as verified, and the OTP is reset.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.otp - The OTP provided by the user for verification.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response
   */
  verifyAccount: async (req, res) => {
    const providedOtp = req.params.otp;
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      // Check if user exists and OTP matches
      if (user.otp === providedOtp) {
        await User.findByIdAndUpdate(
          req.user.id,
          { verified: true, otp: "none" },
          { new: true }
        );
        const user = await User.findById(req.user.id);
        const { password, __v, otp, createdAt, ...others } = user._doc;
        return res.status(200).json({ ...others });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "OTP verification failed" });
      }
    } catch (error) {
      console.error(
        "[userController.verifyAccount]: Error verifying account = ",
        error.message
      );
      return res.status(500).json({
        status: false,
        message: "Failed to verify account",
        error: error.message,
      });
    }
  },

  /**
   * Verifies a user's phone number.
   *
   * This function checks whether the user exists, then updates the user's phone number
   * and sets the phone verification status to true. Optionally, it can reset the OTP
   * as part of the verification process.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.phone - The phone number provided by the user for verification.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response
   */
  verifyPhone: async (req, res) => {
    const phone = req.params.phone;
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      user.phoneVerification = true;
      user.phone = phone; // Optionally reset the OTP
      await user.save();

      const { password, __v, otp, createdAt, ...others } = user._doc;
      return res.status(200).json({ ...others });
    } catch (error) {
      console.error(
        "[userController.verifyPhone]: Error verifying phone = ",
        error.message
      );
      return res.status(500).json({
        status: false,
        message: "Failed to verify phone number",
        error: error.message,
      });
    }
  },

  /**
   * Updates a user's FCM (Firebase Cloud Messaging) token.
   *
   * This function updates the FCM token of the logged-in user in the database. If the user
   * is of type "Driver", the function also subscribes the user's FCM token to the "delivery"
   * topic for push notifications.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.token - The new FCM token provided by the user.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a JSON response
   */
  updateFcm: async (req, res) => {
    const token = req.params.token;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      user.fcm = token;

      if (user.userType == "Driver") {
        await admin.messaging().subscribeToTopic(user.fcm, "delivery");
      }

      await user.save();
      return res
        .status(200)
        .json({ status: true, message: "FCM token updated successfully" });
    } catch (error) {
      console.error(
        "[userController.updateFcm]: Error updating FCM token = ",
        error.message
      );
      return res.status(500).json({
        status: false,
        message: "Failed to update FCM token",
        error: error.message,
      });
    }
  },

  /**
   * Sends a push notification using Firebase Cloud Messaging (FCM).
   *
   * This function constructs a message from the request body and sends it to the specified device
   * using Firebase Cloud Messaging (FCM). It logs success or failure information to the console.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request containing the message details.
   * @param {string} req.body.title - The title of the notification.
   * @param {string} req.body.messageBody - The body text of the notification.
   * @param {Object} req.body.data - Additional data to be sent with the notification.
   * @param {string} req.body.deviceToken - The FCM token of the device to receive the notification.
   * @param {Object} res - The response object.
   *
   * @returns {void} Sends a response after attempting to send the notification
   */
  sendPushNotification: async (req, res) => {
    const body = req.body;
    console.log("[userController.sendPushNotification]: data = ", req.body);

    const message = {
      notification: {
        title: body.title,
        body: body.messageBody,
      },
      data: body.data,
      token: body.deviceToken,
    };

    try {
      await admin
        .messaging()
        .send(message)
        .then((response) => {
          console.info(
            "[userController.sendPushNotification]: Successfully sent message = ",
            response
          );
        })
        .catch((error) => {
          console.info(
            "[userController.sendPushNotification]: Error = ",
            error
          );
        });
      console.log(
        "[userController.sendPushNotification]: Push notification sent successfully = ",
        message
      );

      // Return success response to the client
      res.status(200).json({
        status: true,
        message: "Push notification sent successfully",
        response,
      });
    } catch (error) {
      console.error(
        "[userController.sendPushNotification]: Error sending push notification = ",
        error.message
      );
      res.status(500).json({
        status: false,
        message: "Failed to send push notification",
        error: error.message,
      });
    }
  },
};
