const Food = require("../models/Food");

module.exports = {
  /**
   * Adds a new food item to the database.
   *
   * This function creates a new food item based on the data provided in the request body.
   * It saves the food item to the database and sends a response indicating success or failure.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.body - The body of the request containing the food item data.
   * @param {Object} res - The HTTP response object used to send back the HTTP response.
   *
   * @returns {Object} A JSON response indicating the success or failure of the operation.
   */
  addFood: async (req, res) => {
    const newFood = new Food(req.body);

    try {
      await newFood.save();

      res
        .status(201)
        .json({ status: true, message: "Food item successfully created" });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to create food item",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a food item by its ID.
   *
   * This function queries the database for a food item based on the provided food ID.
   * If the food item is found, it returns the details of the food item. Otherwise, it returns a "not found" message.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the food item to retrieve.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with the food item details if found, or an error message if not found.
   */
  getFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId); // populate the restaurant field if needed

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }

      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get food by id",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves nearby food items based on the user's location.
   *
   * This function fetches food items within a specified radius from the user's location
   * using latitude and longitude coordinates. It uses MongoDB's `$geoNear` aggregation
   * to perform the location-based query and returns a list of nearby food items.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.query - The query parameters.
   * @param {string} req.query.lat - The latitude of the user's location.
   * @param {string} req.query.lng - The longitude of the user's location.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with the list of nearby food items or an error message if the request fails.
   */
  getFoodNearby: async (req, res) => {
    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lng);
    const radius = 5000; // Radius in meters
    const limit = 5;

    // Validate latitude and longitude
    if (!latitude || !longitude) {
      return res.status(400).json({
        status: false,
        message: "Latitude and longitude are required",
      });
    }

    try {
      // Perform the geo-based query to find nearby food items
      const food = await Food.aggregate([
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

      // Return the nearby food items
      return res.status(200).json(food);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve nearby food items",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves food items for a specific restaurant.
   *
   * This function fetches a list of food items associated with a particular restaurant
   * based on the provided restaurant ID. It queries the `Food` model for all food items
   * that are linked to the specified restaurant.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.restaurantId - The ID of the restaurant for which to retrieve food items.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response containing the list of food items for the restaurant,
   *                   or an error message if no food items are found or if an error occurs.
   */
  getFoodsByRestaurant: async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
      const foods = await Food.find({ restaurant: restaurantId });

      if (!foods || foods.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No food items found for this restaurant",
        });
      }

      res.status(200).json(foods);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve food by restaurant",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a list of food items for a specific restaurant.
   *
   * This function fetches a list of food items associated with a particular restaurant
   * based on the provided restaurant ID. It queries the `Food` model for all food items
   * that are linked to the specified restaurant.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.restaurantId - The ID of the restaurant for which to retrieve food items.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response containing the list of food items for the restaurant,
   *                   or an error message if no food items are found or if an error occurs.
   */
  getFoodListByRestaurant: async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
      const foods = await Food.find({ restaurant: restaurantId });

      if (!foods || foods.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No food items found for this restaurant",
        });
      }

      res.status(200).json(foods);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve list food by restaurant",
        error: error.message,
      });
    }
  },

  /**
   * Deletes a food item by its ID.
   *
   * This function deletes a specific food item from the database based on the provided
   * food ID. It attempts to find and delete the food item, and returns an appropriate
   * response depending on whether the deletion was successful or if the food item was not found.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the food item to be deleted.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating the success or failure of the deletion operation.
   */
  deleteFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findByIdAndDelete(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Food item successfully deleted" });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to delete food item",
        error: error.message,
      });
    }
  },

  /**
   * Toggles the availability status of a food item by its ID.
   *
   * This function changes the availability of a food item by updating the `isAvailable`
   * field. It finds the food item using the provided food ID, toggles its availability,
   * and saves the updated information to the database. A response is sent indicating
   * whether the availability was successfully toggled or if the food item was not found.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the food item whose availability will be toggled.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating whether the availability was toggled successfully
   *                   or if the food item was not found.
   */
  foodAvailability: async (req, res) => {
    const foodId = req.params.id;

    try {
      // Attempt to find the food item by its ID
      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ message: "Food not found" });
      }

      // Toggle the availability status and save
      food.isAvailable = !food.isAvailable;
      await food.save();

      // Return success message
      res.status(200).json({ message: "Availability toggled successfully" });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to toggle food availability",
        error: error.message,
      });
    }
  },

  /**
   * Updates a food item by its ID with the provided details.
   *
   * This function allows updating the details of a food item using the provided food ID.
   * It first checks if the `location` field is present in the request body; if not, it sets
   * it to a default "Point" type. The function then attempts to update the food item in the
   * database using the provided data. If the food item is not found, a 404 response is returned.
   * Otherwise, a success message is returned upon successful update.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the food item to update.
   * @param {Object} req.body - The request body containing the updated food item details.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating whether the food item was successfully updated
   * or not found.
   */
  updateFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      // If location is not provided, set it to a default "Point" type
      if (!req.body.location || !req.body.location.type) {
        req.body.location = { type: "Point", ...req.body.location };
      }

      // Attempt to update the food item with the provided details
      const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedFood) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Food item successfully updated" });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to update food item",
        error: error.message,
      });
    }
  },

  /**
   * Adds a tag to a food item by its ID.
   *
   * This function allows adding a new tag to a specific food item based on its ID. The tag
   * is provided in the request body. It first checks if the tag is already assigned to the
   * food item. If the tag exists, a 400 error is returned. If the food item is found, the tag
   * is added and saved successfully.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the food item to which the tag is being added.
   * @param {Object} req.body - The request body containing the tag to be added.
   * @param {string} req.body.tag - The tag to be added to the food item.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response indicating whether the tag was successfully added or
   * if any errors occurred, such as the tag already existing or the food item not being found.
   */
  addFoodTag: async (req, res) => {
    const foodId = req.params.id;
    const { tag } = req.body;

    if (!tag) {
      return res
        .status(400)
        .json({ status: false, message: "Tag is required" });
    }

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }

      // Check if the tag already exists for the food item
      if (food.foodTags.includes(tag)) {
        return res
          .status(400)
          .json({ status: false, message: "Tag already exists" });
      }

      // Add the tag and save the updated food item
      food.foodTags.push(tag);
      await food.save();

      res
        .status(200)
        .json({ status: true, message: "Tag successfully added", data: food });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to add tag to food item",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a random set of food items based on a specific code.
   *
   * This function fetches food items from the database that match the provided code in the route parameters.
   * It then randomly selects a subset of 5 food items and returns them to the client. The function uses
   * MongoDB's aggregation framework to match food items by code, sample a random set, and project only the
   * necessary fields in the response.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.code - The code to filter the food items by.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response containing a random set of food items that match the provided code,
   * or an error message in case of a failure.
   */
  getRandomFoodsByCode: async (req, res) => {
    try {
      // Fetch a random set of food items matching the provided code
      const randomFoodItems = await Food.aggregate([
        { $match: { code: req.params.code } },
        { $sample: { size: 5 } },
        { $project: { _id: 0 } },
      ]);

      // Return the selected food items
      res.status(200).json(randomFoodItems);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve random food items by code",
        error: error.message,
      });
    }
  },

  /**
   * Adds a new food type to a specific food item.
   *
   * This function adds a new food type to the `foodType` array of the specified food item.
   * It checks if the provided food item exists in the database and whether the type to be added
   * already exists in the `foodType` array. If the type is not already present, it is added to the array.
   * If the food item is not found or the type already exists, an appropriate error message is returned.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the food item to update.
   * @param {Object} req.body - The body of the request, which contains the food type to be added.
   * @param {Object} req.body.foodType - The food type to be added to the food item.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with a success message if the food type is successfully added,
   * or an error message if the food item is not found or the type already exists.
   */
  addFoodType: async (req, res) => {
    const foodId = req.params.id;
    const { foodType } = req.body;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food item not found" });
      }

      // Check if the food type already exists
      if (food.foodType.includes(foodType)) {
        return res
          .status(400)
          .json({ status: false, message: "Type already exists" });
      }

      // Add the new food type and save the food item
      food.foodType.push(foodType);
      await food.save();

      res
        .status(200)
        .json({ status: true, message: "Type successfully added", data: food });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to add food type",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves random food items based on category and code, or by code if no category match.
   *
   * This function fetches random food items that match the provided category and code from the database.
   * If no food items are found with the given category and code, it tries to fetch random food items
   * matching only the code. If no matching food items are found, it defaults to fetching 10 random food items.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.category - The category of the food items.
   * @param {string} req.params.code - The code of the food items.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with the list of random food items based on category and code,
   * or just code if no category match is found, or an error message if something goes wrong.
   */
  getRandomFoodsByCategoryAndCode: async (req, res) => {
    const { category, code } = req.params;

    try {
      // Fetch foods matching both category and code
      let foods = await Food.aggregate([
        { $match: { category: category, code: code } },
        { $sample: { size: 10 } },
      ]);

      // If no foods are found, try fetching foods with just the code
      if (!foods || foods.length === 0) {
        foods = await Food.aggregate([
          { $match: { code: code } },
          { $sample: { size: 10 } },
        ]);
      }

      // If still no foods are found, fetch 10 random foods regardless of category or code
      if (!foods || foods.length === 0) {
        foods = await Food.aggregate([{ $sample: { size: 10 } }]);
      }

      res.status(200).json(foods); // Return the foods found
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve random food items",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a list of food items based on the provided category.
   *
   * This function queries the `Food` collection for food items that belong to the specified category.
   * It returns all food items that match the category or a message if no items are found.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.category - The category of food items to retrieve.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with the list of food items if found, or an error message if no items are found.
   */
  getRandomFoodsByCategory: async (req, res) => {
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({
        status: false,
        message: "Category parameter is required",
      });
    }

    try {
      const foods = await Food.find({ category: category });

      // If no foods found, return a message indicating no foods available
      if (!foods || foods.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No food items found for this category",
        });
      }

      res.status(200).json(foods);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve food items for the category",
        error: error.message,
      });
    }
  },

  /**
   * Searches for food items based on the provided search query.
   *
   * This function uses MongoDB's full-text search functionality to search for food items
   * that match the query string in any field of the `Food` collection.
   * The search is done across all fields of the collection using the specified text index.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.food - The search query string to match food items.
   * @param {Object} res - The HTTP response object used to send the result back to the client.
   *
   * @returns {Object} A JSON response with the search results if found, or an error message in case of failure.
   */
  searchFoods: async (req, res) => {
    const search = req.params.food;

    try {
      // Perform text search on the Food collection using MongoDB Atlas Full-Text Search
      const results = await Food.aggregate([
        {
          $search: {
            index: "foods", // The name of the search index
            text: {
              query: search, // The search query provided by the user
              path: {
                wildcard: "*", // Search across all fields
              },
            },
          },
        },
      ]);

      // Return the search results
      res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve food search results",
        error: error.message,
      });
    }
  },
};
