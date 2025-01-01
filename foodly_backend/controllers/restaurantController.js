const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

module.exports = {
  /**
   * Adds a new restaurant to the system.
   *
   * This function creates a new restaurant record in the database. It first checks if the user already
   * owns a restaurant. If a restaurant is already registered under the user's account, it returns an
   * error message. If not, it creates a new restaurant with the provided data, saves it to the database,
   * and updates the user's account type to "Vendor".
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request containing the restaurant data.
   * @param {string} req.body.name - The name of the restaurant.
   * @param {string} req.body.address - The address of the restaurant.
   * @param {string} req.body.code - The unique code for the restaurant.
   * @param {Object} req.user - The authenticated user making the request.
   * @param {string} req.user.id - The ID of the authenticated user.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  addRestaurant: async (req, res) => {
    console.log("[restaurantController.addRestaurant]: body =", req.body);
    const owner = req.user.id;

    const existingRestaurant = await Restaurant.findOne({ owner: owner });
    if (existingRestaurant) {
      return res.status(400).json({
        status: false,
        message: "Restaurant with this code already exists",
        data: existingRestaurant,
      });
    }

    const newRestaurant = new Restaurant(req.body);

    try {
      const data = await newRestaurant.save();
      await User.findByIdAndUpdate(
        owner,
        { userType: "Vendor" },
        { new: true, runValidators: true }
      );
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while adding the restaurant",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves nearby restaurants based on the provided latitude and longitude.
   *
   * This function uses the `$geoNear` aggregation pipeline operator to find nearby restaurants
   * within a specified radius (default 5000 meters). The function returns a list of nearby
   * restaurants limited to 5 results. The location is based on the latitude and longitude
   * provided in the query parameters.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.query - The query parameters of the request.
   * @param {number} req.query.lat - Latitude of the user's location.
   * @param {number} req.query.lng - Longitude of the user's location.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getNearbyRestaurants: async (req, res) => {
    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lng);
    const radius = 5000;
    const limit = 5;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    try {
      const restaurants = await Restaurant.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            maxDistance: radius,
            spherical: true,
          },
        },
        {
          $limit: limit,
        },
      ]);

      return res.status(200).json(restaurants);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieving nearby restaurants",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a random list of restaurants, either based on a provided code or just random restaurants.
   *
   * This function attempts to fetch random restaurants from the database. If a specific restaurant code
   * is provided in the request parameters, the function will filter the restaurants by that code,
   * returning a random sample of 5 restaurants. If no code is provided or no restaurants match the
   * provided code, the function will return a random selection of 5 restaurants without filtering by code.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The URL parameters of the request.
   * @param {string} [req.params.code] - The optional restaurant code for filtering.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getRandomRestaurants: async (req, res) => {
    try {
      let randomRestaurants = [];

      // Check if code is provided in the params
      if (req.params.code) {
        randomRestaurants = await Restaurant.aggregate([
          { $match: { code: req.params.code } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      // If no code provided in params or no restaurants match the provided code
      if (!randomRestaurants.length) {
        randomRestaurants = await Restaurant.aggregate([
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      // Respond with the results
      if (randomRestaurants.length) {
        res.status(200).json(randomRestaurants);
      } else {
        res.status(404).json({ message: "No restaurants found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching random restaurants",
        error: error.message,
      });
    }
  },

  /**
   * Toggles the availability status of a restaurant.
   *
   * This function allows the restaurant owner to toggle the `isAvailable` status of their restaurant.
   * When this function is called, it checks if the restaurant exists based on the provided ID.
   * If the restaurant is found, the `isAvailable` status is flipped (from `true` to `false` or vice versa),
   * and the changes are saved to the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The URL parameters of the request.
   * @param {string} req.params.id - The ID of the restaurant whose availability is to be toggled.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  serviceAvailability: async (req, res) => {
    const restaurantId = req.params.id;

    try {
      // Find the restaurant by its ID
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Toggle the isAvailable field
      restaurant.isAvailable = !restaurant.isAvailable;

      // Save the changes
      await restaurant.save();

      res.status(200).json({
        message: "Availability toggled successfully",
        isAvailable: restaurant.isAvailable,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while toggling availability",
        error: error.message,
      });
    }
  },

  /**
   * Deletes a restaurant from the database.
   *
   * This function allows the restaurant owner or an authorized user to delete a restaurant
   * by its unique ID. The ID of the restaurant to be deleted is provided as a URL parameter.
   * If the restaurant ID is missing or invalid, a `400` error is returned.
   * If the restaurant is successfully deleted, a success message is returned.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The URL parameters of the request.
   * @param {string} req.params.id - The ID of the restaurant to be deleted.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  deleteRestaurant: async (req, res) => {
    const id = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Restaurant ID is required for deletion.",
      });
    }

    try {
      await Restaurant.findByIdAndRemove(id);

      res
        .status(200)
        .json({ status: true, message: "Restaurant successfully deleted" });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while deleting the restaurant.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a restaurant by its unique ID.
   *
   * This function fetches a restaurant's details from the database based on the provided
   * restaurant ID in the URL parameters. If the restaurant is found, its details are returned
   * in the response. If no restaurant is found with the given ID, a `404` error is returned.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The URL parameters of the request.
   * @param {string} req.params.id - The ID of the restaurant to retrieve.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getRestaurant: async (req, res) => {
    const id = req.params.id;

    try {
      const restaurant = await Restaurant.findById(id); // populate the restaurant field if needed
      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "restaurant item not found" });
      }
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching the restaurant",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a restaurant associated with the current authenticated user.
   *
   * This function fetches a restaurant's details from the database based on the `owner` field,
   * which is linked to the current authenticated user's ID. If a restaurant is found, its details
   * are returned in the response. If no restaurant is found for the current user, a `404` error
   * is returned.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.user - The authenticated user object.
   * @param {string} req.user.id - The ID of the authenticated user.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getRestaurantByOwner: async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({ owner: req.user.id }); // populate the restaurant field if needed
      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "restaurant item not found" });
      }
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching the restaurant",
        error: error.message,
      });
    }
  },
};
