const Rating = require("../models/Rating");
const Restaurant = require("../models/Restaurant");

module.exports = {
  /**
   * Adds or updates the rating for a restaurant by the authenticated user.
   *
   * This function allows the user to rate a restaurant. If the rating is successfully
   * added, the average rating for the restaurant is recalculated and updated in the database.
   * If the user has already rated the restaurant, a new rating is added, and the average rating
   * is updated accordingly.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request containing rating information.
   * @param {string} req.body.userId - The ID of the user rating the restaurant.
   * @param {string} req.body.restaurantId - The ID of the restaurant being rated.
   * @param {number} req.body.rating - The rating provided by the user (e.g., 1-5).
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  addOrUpdateRating: async (req, res) => {
    const { userId, restaurantId, rating } = req.body;

    try {
      const newRating = new Rating({ userId, restaurantId, rating });
      console.log(
        "[ratingController.addOrUpdateRating]: newRating = ",
        newRating
      );
      await newRating.save();

      const restaurants = await Rating.aggregate([
        { $match: { restaurantId: restaurantId } },
        {
          $group: { _id: "$restaurantId", averageRating: { $avg: "$rating" } },
        },
      ]);
      console.log(
        "[ratingController.addOrUpdateRating]: restaurant = ",
        restaurants
      );

      if (restaurants.length > 0) {
        const averageRating = restaurants[0].averageRating;
        await Restaurant.findByIdAndUpdate(
          restaurantId,
          { rating: averageRating },
          { new: true }
        );
        console.log("[ratingController.addOrUpdateRating]: updated ");
      }
      return res.status(200).json({ status: true });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  /**
   * Checks if the authenticated user has already rated a specific restaurant.
   *
   * This function checks whether the currently authenticated user has rated the restaurant
   * with the given `restaurantId`. If the user has already rated the restaurant, it returns
   * the rating along with a message indicating that the user has rated the restaurant.
   * If the user has not rated the restaurant, it returns a message indicating that the user
   * has not rated it yet.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.query - The query parameters of the request.
   * @param {string} req.query.restaurantId - The ID of the restaurant to check.
   * @param {Object} req.user - The authenticated user object containing the user's ID.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  checkIfUserRatedRestaurant: async (req, res) => {
    const restaurantId = req.query.restaurantId;
    const userId = req.user.id;

    try {
      const ratingExists = await Rating.findOne({
        userId: userId,
        restaurantId: restaurantId,
      });

      if (ratingExists) {
        return res.status(200).json({
          status: true,
          message: "You have already rated this restaurant.",
          rating: ratingExists.rating,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "User has not rated this restaurant yet.",
        });
      }
    } catch (error) {
      console.error(
        "[ratingController.checkIfUserRatedRestaurant]: Error =",
        error.message
      );
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};
