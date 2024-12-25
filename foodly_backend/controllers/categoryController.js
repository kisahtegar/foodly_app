const Category = require("../models/Category");

module.exports = {
  /**
   * Creates a new category in the database.
   *
   * This function accepts category details from the request body, creates a new category document,
   * and saves it to the database. Upon success, it returns a success message with a 201 status code.
   * If an error occurs during the process, it catches the error and returns a 500 status with the error message.
   *
   * @param {Object} req - The request object containing the category data in `req.body`.
   * @param {Object} res - The response object to send back the result of the operation.
   *
   * @returns {Object} - A response indicating the success or failure of the operation.
   */
  createCategory: async (req, res) => {
    const newCategory = new Category(req.body);

    try {
      await newCategory.save();

      res
        .status(201)
        .json({ status: true, message: "Category successfully created" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  /**
   * Updates an existing category in the database.
   *
   * This function accepts the category ID from the URL parameter (`req.params.id`) and the new category
   * details from the request body (`req.body`). It attempts to update the category in the database. If successful,
   * it returns a success message. If the category is not found or an error occurs during the update,
   * it returns an error message.
   *
   * @param {Object} req - The request object containing the category ID in `req.params.id`
   * and the updated category details in `req.body`.
   * @param {Object} res - The response object to send back the result of the operation.
   *
   * @returns {Object} - A response indicating the success or failure of the operation.
   */
  updateCategory: async (req, res) => {
    const id = req.params.id;
    const { title, value, imageUrl } = req.body;

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          title: title,
          value: value,
          imageUrl: imageUrl,
        },
        { new: true }
      ); // This option ensures the updated document is returned

      if (!updatedCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found." });
      }

      res
        .status(200)
        .json({ status: true, message: "Category successfully updated" });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while updating the category.",
      });
    }
  },

  /**
   * Deletes a category from the database.
   *
   * This function accepts the category ID from the URL parameter (`req.params.id`). It attempts to find
   * and remove the specified category from the database. If successful, it returns a success message.
   * If the category is not found or an error occurs during the deletion,
   * it returns an error message.
   *
   * @param {Object} req - The request object containing the category ID in `req.params.id`.
   * @param {Object} res - The response object to send back the result of the operation.
   *
   * @returns {Object} - A response indicating the success or failure of the operation.
   */
  deleteCategory: async (req, res) => {
    const id = req.params.id;

    // Validate that the category ID is provided
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Category ID is required for deletion.",
      });
    }

    try {
      // Attempt to find and remove the category from the database
      const deletedCategory = await Category.findByIdAndRemove(id);

      // If the category is not found, return a 404 error
      if (!deletedCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found." });
      }

      res
        .status(200)
        .json({ status: true, message: "Category successfully deleted" });
    } catch (error) {
      // Log the error and send a failure response if something goes wrong
      console.error("Error deleting category:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while deleting the category.",
      });
    }
  },

  /**
   * Retrieves all categories from the database, excluding the "More" category.
   *
   * This function fetches all categories from the database, excluding the category
   * with the title "More". The response will not include the `__v` field (used for
   * versioning in Mongoose). If successful, the categories are returned in the response.
   * In case of any errors, a generic error message is sent in the response.
   *
   * @param {Object} req - The request object (not used in this function, but needed for consistency).
   * @param {Object} res - The response object to send back the categories or an error.
   *
   * @returns {Object} - A response containing the list of categories or an error message.
   */
  getAllCategories: async (req, res) => {
    try {
      // Fetch categories from the database, excluding "More" and the __v field
      const categories = await Category.find(
        { title: { $ne: "More" } }, // Exclude the category with title "More"
        { __v: 0 } // Exclude the version field from the results
      );

      res.status(200).json(categories);
    } catch (error) {
      // If an error occurs, log it and return a 500 status code with an error message
      console.error("Error fetching categories:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching the categories.",
      });
    }
  },

  /**
   * Updates the image URL of a specific category.
   *
   * This function updates the `imageUrl` field of a category identified by its ID.
   * The update is performed using `findByIdAndUpdate` for efficiency.
   *
   * @param {Object} req - The request object containing the category ID in `req.params.id` and the new image URL in `req.body.imageUrl`.
   * @param {Object} res - The response object used to send the result or an error message.
   *
   * @returns {Object} - A response indicating success or failure.
   */
  patchCategoryImage: async (req, res) => {
    const id = req.params.id;
    const { imageUrl } = req.body;

    if (!id || !imageUrl) {
      return res.status(400).json({
        status: false,
        message: "Category ID and image URL are required.",
      });
    }

    try {
      // Update the image URL of the category in the database
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: { imageUrl: imageUrl } },
        { new: true } // Return the updated document
      );

      if (!updatedCategory) {
        return res.status(404).json({
          status: false,
          message: "Category not found.",
        });
      }

      // Respond with success
      res.status(200).json({
        status: true,
        message: "Category image successfully patched",
        data: updatedCategory,
      });
    } catch (error) {
      // Handle errors and respond with an appropriate message
      console.error("Error patching category image:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while patching the category image.",
      });
    }
  },

  /**
   * Fetches a random set of categories and appends a specific "More" category to the result.
   *
   * This function retrieves a random selection of 7 categories from the database
   * (excluding the "More" category), and then appends the "More" category to the result.
   *
   * @param {Object} req - The request object. It is not used in this function.
   * @param {Object} res - The response object used to send the result or an error message.
   *
   * @returns {Object} - A response containing the random categories with the "More" category appended.
   */
  getRandomCategories: async (req, res) => {
    try {
      let categories = await Category.aggregate([
        { $match: { value: { $ne: "more" } } }, // Exclude the "more" category from random selection
        { $sample: { size: 7 } }, // Get 7 random categories
      ]);

      // Find the "More" category in the database
      const moreCategory = await Category.findOne({ value: "more" });

      if (moreCategory) {
        categories.push(moreCategory);
      }
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching limited categories:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching the categories.",
      });
    }
  },
};
