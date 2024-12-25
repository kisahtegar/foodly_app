const router = require("express").Router();
const addressController = require("../controllers/addressController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * POST /api/address
 * @description Creates a new address for the authenticated user.
 * @route {POST} /api/address
 * @access Private
 */
router.post("/", verifyTokenAndAuthorization, addressController.createAddress);

/**
 * DELETE /api/address/:id
 * @description Deletes an address by its ID for the authenticated user.
 * @route {DELETE} /api/address/:id
 * @access Private
 */
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  addressController.deleteAddress
);

/**
 * GET /api/address/default
 * @description Retrieves the default address for the authenticated user.
 * @route {GET} /api/address/default
 * @access Private
 */
router.get(
  "/default",
  verifyTokenAndAuthorization,
  addressController.getDefaultAddress
);

/**
 * GET /api/address/all
 * @description Retrieves all addresses associated with the authenticated user.
 * @route {GET} /api/address/all
 * @access Private
 */
router.get(
  "/all",
  verifyTokenAndAuthorization,
  addressController.getUserAddresses
);

/**
 * PUT /api/address/:id
 * @description Updates a specific address by ID for the authenticated user.
 * @route {PUT} /api/address/:id
 * @access Private
 */
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  addressController.updateAddress
);

/**
 * PATCH /api/address/default/:address
 * @description Sets a specific address as the default address for the authenticated user.
 * @route {PATCH} /api/address/default/:address
 * @access Private
 */
router.patch(
  "/default/:address",
  verifyTokenAndAuthorization,
  addressController.setDefaultAddress
);

module.exports = router;
