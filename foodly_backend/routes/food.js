const router = require("express").Router();
const foodController = require("../controllers/foodController");

/**
 * POST /api/foods
 * @description Adds a new food item.
 * @route {POST} /api/food
 * @access Private (requires authentication)
 */
router.post("/", foodController.addFood);

/**
 * PUT /api/foods/update/:id
 * @description Updates food details by ID.
 * @route {PUT} /api/food/update/:id
 * @access Private (requires authentication)
 */
router.put("/update/:id", foodController.updateFoodById);

/**
 * GET /api/foods/restaurant-foods/:restaurantId
 * @description Fetches the list of foods for a specific restaurant.
 * @route {GET} /api/food/restaurant-foods/:restaurantId
 * @access Public
 */
router.get(
  "/restaurant-foods/:restaurantId",
  foodController.getFoodListByRestaurant
);

/**
 * GET /api/foods/nearby
 * @description Fetches nearby food items.
 * @route {GET} /api/food/nearby
 * @access Public
 */
router.get("/nearby", foodController.getFoodNearby);

/**
 * POST /api/foods/tags/:id
 * @description Adds a tag to a food item by ID.
 * @route {POST} /api/food/tags/:id
 * @access Private (requires authentication)
 */
router.post("/tags/:id", foodController.addFoodTag);

/**
 * POST /api/foods/type/:id
 * @description Adds a type to a food item by ID.
 * @route {POST} /api/food/type/:id
 * @access Private (requires authentication)
 */
router.post("/type/:id", foodController.addFoodType);

/**
 * GET /api/foods/search/:food
 * @description Searches for food items by name.
 * @route {GET} /api/food/search/:food
 * @access Public
 */
router.get("/search/:food", foodController.searchFoods);

/**
 * GET /api/foods/category/:category
 * @description Fetches random food items by category.
 * @route {GET} /api/food/category/:category
 * @access Public
 */
router.get("/category/:category", foodController.getRandomFoodsByCategory);

/**
 * GET /api/foods/restaurant/:restaurantId
 * @description Fetches foods for a specific restaurant by ID.
 * @route {GET} /api/food/restaurant/:restaurantId
 * @access Public
 */
router.get("/restaurant/:restaurantId", foodController.getFoodsByRestaurant);

/**
 * GET /api/foods/recommendation/:code
 * @description Fetches food recommendations by code.
 * @route {GET} /api/food/recommendation/:code
 * @access Public
 */
router.get("/recommendation/:code", foodController.getRandomFoodsByCode);

/**
 * GET /api/foods/:category/:code
 * @description Fetches random food items by category and code.
 * @route {GET} /api/food/:category/:code
 * @access Public
 */
router.get("/:category/:code", foodController.getRandomFoodsByCategoryAndCode);

/**
 * DELETE /api/foods/:id
 * @description Deletes a food item by ID.
 * @route {DELETE} /api/food/:id
 * @access Private (requires authentication)
 */
router.delete("/:id", foodController.deleteFoodById);

/**
 * PATCH /api/foods/:id
 * @description Toggles the availability of a food item by ID.
 * @route {PATCH} /api/food/:id
 * @access Private (requires authentication)
 */
router.patch("/:id", foodController.foodAvailability);

/**
 * GET /api/foods/:id
 * @description Fetches food details by ID.
 * @route {GET} /api/food/:id
 * @access Public
 */
router.get("/:id", foodController.getFoodById);

module.exports = router;
