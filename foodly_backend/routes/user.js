const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * POST /api/user/sendNotification
 * @description Sends a push notification to the user.
 * @route {POST} /api/user/sendNotification
 * @access Private (requires authentication)
 */
router.post("/sendNotification", userController.sendPushNotification);

/**
 * PUT /api/user/
 * @description Updates the profile of the authenticated user.
 * @route {PUT} /api/user/
 * @access Private (requires authentication)
 */
router.put("/", verifyTokenAndAuthorization, userController.updateUser);

/**
 * GET /api/user/verify/:otp
 * @description Verifies the user's account using the provided OTP.
 * @route {GET} /api/user/verify/:otp
 * @access Private (requires authentication)
 */
router.get(
  "/verify/:otp",
  verifyTokenAndAuthorization,
  userController.verifyAccount
);

/**
 * DELETE /api/user/
 * @description Deletes the authenticated user's account.
 * @route {DELETE} /api/user/
 * @access Private (requires authentication)
 */
router.delete("/", verifyTokenAndAuthorization, userController.deleteUser);

/**
 * GET /api/user/
 * @description Fetches details of the authenticated user.
 * @route {GET} /api/user/
 * @access Private (requires authentication)
 */
router.get("/", verifyTokenAndAuthorization, userController.getUser);

/**
 * GET /api/user/verify_phone/:phone
 * @description Verifies if the provided phone number is valid.
 * @route {GET} /api/user/verify_phone/:phone
 * @access Private (requires authentication)
 */
router.get(
  "/verify_phone/:phone",
  verifyTokenAndAuthorization,
  userController.verifyPhone
);

/**
 * PUT /api/user/updateToken/:token
 * @description Updates the user's FCM (Firebase Cloud Messaging) token.
 * @route {PUT} /api/user/updateToken/:token
 * @access Private (requires authentication)
 */
router.put(
  "/updateToken/:token",
  verifyTokenAndAuthorization,
  userController.updateFcm
);

module.exports = router;
