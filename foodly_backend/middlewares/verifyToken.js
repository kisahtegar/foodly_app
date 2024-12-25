const jwt = require("jsonwebtoken");

/**
 * Middleware to verify the JWT token in the request headers. It checks the authorization
 * header for a valid token. If valid, it attaches the decoded user data to `req.user`.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: false, message: "You are not authenticated" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) {
      console.error("[middleware.verifyToken]: JWT Error", err); // Log the error for debugging
      return res.status(403).json({ status: false, message: "Invalid token" });
    }

    // Attach user info to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

/**
 * Middleware function that verifies the token and checks if the user has authorization
 * based on their user type. If the user type is one of "Client", "Vendor", "Admin",
 * or "Driver", the request will proceed; otherwise, it returns a 403 Forbidden status.
 *
 * This function combines token verification and user authorization in one middleware.
 * It first ensures the request has a valid JWT token and then checks if the user type
 * is allowed to perform the requested operation.
 *
 * @param {Object} req - The request object, containing the JWT token in the `Authorization` header
 * @param {Object} res - The response object used to send responses to the client
 * @param {function} next - The next middleware function to be executed if the user is authorized
 *
 * @returns {void} - If authorized, the next middleware or route handler is called.
 */
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === "Client" ||
      req.user.userType === "Vendor" ||
      req.user.userType === "Admin" ||
      req.user.userType === "Driver"
    ) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "You are restricted from perfoming this operation",
      });
    }
  });
};

/**
 * Middleware function to verify the token and check if the user has a "Vendor" or
 * "Admin" user type. If the user type is "Vendor" or "Admin", the request will
 * proceed; otherwise, it returns a 403 Forbidden status.
 *
 * This middleware ensures that only vendors and administrators can access certain routes.
 *
 * @param {Object} req - The request object, containing the JWT token in the `Authorization` header
 * @param {Object} res - The response object used to send responses to the client
 * @param {function} next - The next middleware function to be executed if the user is a vendor or admin
 *
 * @returns {void} - If authorized, the next middleware or route handler is called.
 */
const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Vendor" || req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You have limited access" });
    }
  });
};

/**
 * Middleware function to verify the token and check if the user has a "Driver" or "Admin" user type.
 * If the user type is "Driver" or "Admin", the request will proceed; otherwise, it returns a 403 Forbidden status.
 *
 * This middleware ensures that only drivers and administrators can access certain routes.
 *
 * @param {Object} req - The request object, containing the JWT token in the `Authorization` header
 * @param {Object} res - The response object used to send responses to the client
 * @param {function} next - The next middleware function to be executed if the user is a driver or admin
 *
 * @returns {void} - If authorized, the next middleware or route handler is called.
 */
const verifyDriver = (req, res, next) => {
  console.log("[middleware.verifyDriver] Initial Token Payload:", req.user);

  verifyToken(req, res, () => {
    console.log("[middleware.verifyDriver] Verified Token Payload:", req.user);
    if (req.user.userType === "Driver" || req.user.userType === "Admin") {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "You are restricted from performing this operation",
      });
    }
  });
};

/**
 * Middleware function to verify the token and check if the user has an "Admin" user type.
 * If the user type is "Admin", the request will proceed; otherwise, it returns a 403 Forbidden status.
 *
 * This middleware ensures that only admins can access certain routes.
 *
 * @param {Object} req - The request object, containing the JWT token in the `Authorization` header
 * @param {Object} res - The response object used to send responses to the client
 * @param {function} next - The next middleware function to be executed if the user is an admin
 *
 * @returns {void} - If authorized, the next middleware or route handler is called.
 */
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Admin") {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "You are restricted from perfoming this operation",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyVendor,
  verifyDriver,
  verifyAdmin,
};
