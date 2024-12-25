const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * GET /api/restaurant/byId/:id
 * @description Fetches a specific restaurant by its ID.
 * @route {GET} /api/restaurant/byId/:id
 * @access Public
 */
router.get("/byId/:id", restaurantController.getRestaurant);

/**
 * POST /api/restaurant
 * @description Adds a new restaurant (requires authentication).
 * @route {POST} /api/restaurant
 * @access Private (requires authentication)
 */
router.post(
  "/",
  verifyTokenAndAuthorization,
  restaurantController.addRestaurant
);

/**
 * GET /api/restaurant/nearby
 * @description Fetches a list of nearby restaurants.
 * @route {GET} /api/restaurant/nearby
 * @access Public
 */
router.get("/nearby", restaurantController.getNearbyRestaurants);

/**
 * GET /api/restaurant/owner/profile
 * @description Fetches the restaurant owned by the authenticated user.
 * @route {GET} /api/restaurant/owner/profile
 * @access Private (requires authentication)
 */
router.get(
  "/owner/profile",
  verifyTokenAndAuthorization,
  restaurantController.getRestaurantByOwner
);

/**
 * PATCH /api/restaurant/:id
 * @description Toggles the service availability of a restaurant.
 * @route {PATCH} /api/restaurant/:id
 * @access Private (requires authentication)
 */
router.patch("/:id", restaurantController.serviceAvailability);

/**
 * GET /api/restaurant/:code
 * @description Fetches a random restaurant based on the given code.
 * @route {GET} /api/restaurant/:code
 * @access Public
 */
router.get("/:code", restaurantController.getRandomRestaurants);

module.exports = router;
