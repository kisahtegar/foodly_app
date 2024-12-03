const Restaurant = require("../models/Restaurant");

module.exports = {
  addRestaurant: async (req, res) => {
    const newRestaurant = new Restaurant(req.body);

    try {
      await newRestaurant.save();
      res
        .status(201)
        .json({ status: true, message: "Restaurant successfully created" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  serviceAvaibility: async (req, res) => {
    const restaurantId = req.params.id;

    try {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }

      restaurant.isAvailable = !restaurant.isAvailable;

      await restaurant.save();
      res.status(200).json({
        status: true,
        message: "Availability successfully toggled",
        isAvailable: restaurant.isAvailable,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error toggling restaurant availability",
      });
    }
  },

  deleteRestaurant: async (req, res) => {
    const restaurantId = req.params.id;

    try {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res
          .status(403)
          .json({ status: false, message: "Restaurant not found" });
      }

      await Restaurant.findByIdAndDelete(restaurantId);
      res
        .status(200)
        .json({ status: true, message: "Restaurant successfully deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error deleting restaurant" });
    }
  },

  getRestaurant: async (req, res) => {
    const restaurantId = req.params.id;

    try {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }

      res.status(200).json(restaurant);
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error retrieving the restaurant" });
    }
  },

  getRandomRestaurants: async (req, res) => {
    try {
      let randomRestaurant = [];

      if (req.params.code) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { code: req.params.code } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (!randomRestaurant.length) {
        randomRestaurant = await Restaurant.aggregate([
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (randomRestaurant.length) {
        res.status(200).json(randomRestaurant);
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error finding restaurants " });
    }
  },
};
