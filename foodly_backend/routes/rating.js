const router = require("express").Router();
const ratingController = require("../controllers/ratingController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * POST /api/rating
 * @description Adds or updates a rating for a restaurant.
 * @route {POST} /api/rating
 * @access Private (requires authentication)
 */
router.post("/", ratingController.addOrUpdateRating);

/**
 * GET /api/rating
 * @description Checks if a user has already rated a restaurant.
 * @route {GET} /api/rating
 * @access Private (requires authentication)
 */
router.get(
  "/",
  verifyTokenAndAuthorization,
  ratingController.checkIfUserRatedRestaurant
);

module.exports = router;
