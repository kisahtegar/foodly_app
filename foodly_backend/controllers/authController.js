const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const sendVerificationEmail = require("../utils/email_verification");
const generateOtp = require("../utils/otp_generator");

module.exports = {
  /**
   * Creates a new user in the system, registers the user with Firebase Authentication,
   * and sends an email verification OTP to the user.
   *
   * This function first checks if a user with the given email already exists in Firebase.
   * If the user exists, it returns an error. If the user doesn't exist, it creates a new
   * user in Firebase, generates an OTP, and saves the user data to the local database with
   * encrypted password. It then sends a verification email to the user with the OTP.
   *
   * @param {Object} req - The request object containing the user data from the body.
   * @param {Object} res - The response object to send the status or error message.
   *
   * @returns {Object} - A success or error response.
   */
  createUser: async (req, res) => {
    const user = req.body;
    console.log("[authController.createUser]: Received user data = ", user);
    try {
      console.log(
        "[authController.createUser]: Checking if user already exists with email = ",
        user.email
      );
      // Check if the email is already registered with Firebase
      await admin.auth().getUserByEmail(user.email);

      console.log(
        "[authController.createUser]: User already exists with email = ",
        user.email
      );
      res.status(400).json({ message: "Email is already registered." });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log(
          "[authController.createUser]: User not found, creating new user with email = ",
          user.email
        );
        try {
          // Create the new user in Firebase Authentication
          const userResponse = await admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false,
          });

          console.log(
            "[authController.createUser]: Firebase user created = ",
            userResponse.uid
          );

          // Generate OTP for email verification
          const otp = generateOtp();
          console.log("[authController.createUser]: Generated OTP = ", otp);

          // Create the user in the local database with encrypted password
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            otp: otp,
            userType: "Client", // Default user type set to "Client"
            uid: userResponse.uid,
            password: CryptoJS.AES.encrypt(
              req.body.password,
              process.env.SECRET
            ).toString(),
          });

          // Save the user to the database
          await newUser.save();
          console.log(
            "[authController.createUser]: New user saved to database = ",
            newUser
          );

          // Send OTP verification email to the user
          sendVerificationEmail(newUser.email, otp);
          console.log(
            "[authController.createUser]: Verification email sent to = ",
            newUser.email
          );

          // Respond with success message
          res.status(201).json({ status: true });
        } catch (createUserError) {
          console.error(
            "[authController.createUser]: Error creating new user = ",
            createUserError
          );
          res
            .status(500)
            .json({ status: false, message: createUserError.message });
        }
      } else {
        console.error(
          "[authController.createUser]: Error retrieving user = ",
          error
        );
        res.status(500).json({ status: false, message: error.message });
      }
    }
  },

  /**
   * Logs in a user
   *
   * This function checks if the provided email exists in the database. If the
   * email is found, it decrypts the stored password and compares it with the
   * provided password. If the passwords match, it generates a JWT token and
   * returns the user data along with the token. If the user is of type "Vendor",
   * it retrieves restaurant coordinates and includes them in the response.
   *
   * @param {Object} req - The request object containing the user's login credentials (email, password).
   * @param {Object} res - The response object to send the status or error message.
   *
   * @returns {Object} - A success response with user data and JWT token, or an error response.
   */
  loginUser: async (req, res) => {
    try {
      console.log("[authController.loginUser]: Received data = ", req.body);

      // Find the user by email
      const user = await User.findOne(
        { email: req.body.email },
        { __v: 0, createdAt: 0, updatedAt: 0 } // Exclude sensitive fields
      );

      console.log("[authController.loginUser]: user = ", user);

      if (!user) {
        // Return error if user is not found
        return res
          .status(401)
          .json({ status: false, message: "Wrong Login Details" });
      }

      let restaurant;
      // If the user is a "Vendor", fetch restaurant data (coordinates)
      if (user.userType === "Vendor") {
        restaurant = await Restaurant.findOne({ owner: user.id }).select({
          coords: 1, // Only fetch coordinates
        });
        console.log(
          "[authController.loginUser]: Restaurant coordinates = ",
          restaurant.coords
        );
      }

      // Decrypt the stored password
      const decryptedPass = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const depassword = decryptedPass.toString(CryptoJS.enc.Utf8);

      // Check if the passwords match
      if (depassword !== req.body.password) {
        return res
          .status(401)
          .json({ status: false, message: "Wrong Login Details" });
      }

      // Generate JWT token
      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      const { password, ...others } = user._doc; // Exclude password from response

      // If the user is a "Client", return basic user data with token
      if (user.userType === "Client") {
        return res.status(200).json({ ...others, userToken });
      } else {
        // If the user is a "Vendor", return restaurant data along with the token
        return res.status(200).json({ ...others, userToken });
      }
    } catch (error) {
      console.error("[authController.loginUser]: Error = ", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
