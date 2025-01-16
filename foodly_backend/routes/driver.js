const router = require("express").Router();
const driverController = require("../controllers/driverController");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * POST /api/driver
 * @description Registers a new driver.
 * @route {POST} /api/driver
 * @access Private (requires authentication)
 */
router.post("/", verifyToken, driverController.registerDriver);

/**
 * PATCH /api/driver/availability/:id
 * @description Toggles driver availability status by ID.
 * @route {PATCH} /api/driver/availability/:id
 * @access Private (requires authentication)
 */
router.patch("/availability/:id", driverController.setDriverAvailability);

/**
 * DELETE /api/driver/:id
 * @description Deletes a driver by ID.
 * @route {DELETE} /api/driver/:id
 * @access Private (requires authentication)
 */
router.delete("/:id", driverController.deleteDriver);

/**
 * PUT /api/driver/:id
 * @description Updates driver details by ID.
 * @route {PUT} /api/driver/:id
 * @access Private (requires authentication)
 */
router.put("/:id", driverController.updateDriverDetails);

/**
 * GET /api/driver/:id
 * @description Fetches the details of a driver by ID.
 * @route {GET} /api/driver/:id
 * @access Public (or Private)
 */
router.get("/:id", driverController.getDriverDetails);

module.exports = router;
