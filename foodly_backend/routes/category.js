const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

/**
 * PUT /api/category/:id
 * @description Updates an existing category by ID.
 * @route {PUT} /api/category/:id
 * @access Private (if applicable)
 */
router.put("/:id", categoryController.updateCategory);

/**
 * POST /api/category
 * @description Creates a new category.
 * @route {POST} /api/category
 * @access Private (if applicable)
 */
router.post("/", categoryController.createCategory);

/**
 * DELETE /api/category/:id
 * @description Deletes a category by ID.
 * @route {DELETE} /api/category/:id
 * @access Private (if applicable)
 */
router.delete("/:id", categoryController.deleteCategory);

/**
 * POST /api/category/image/:id
 * @description Updates the image of a category by ID.
 * @route {POST} /api/category/image/:id
 * @access Private (if applicable)
 */
router.post("/image/:id", categoryController.patchCategoryImage);

/**
 * GET /api/category
 * @description Retrieves all categories.
 * @route {GET} /api/category
 * @access Public (or Private)
 */
router.get("/", categoryController.getAllCategories);

/**
 * GET /api/category/random
 * @description Fetches a random category.
 * @route {GET} /api/category/random
 * @access Public (or Private)
 */
router.get("/random", categoryController.getRandomCategories);

module.exports = router;
