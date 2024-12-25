const router = require("express").Router();
const cartController = require("../controllers/cartController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * POST /api/cart
 * @description Adds a product to the user's cart.
 * @route {POST} /api/cart
 * @access Private
 */
router.post("/", verifyTokenAndAuthorization, cartController.addProductToCart);

/**
 * POST /api/cart/decrement
 * @description Decrements the quantity of a product in the user's cart.
 * @route {POST} /api/cart/decrement
 * @access Private
 */
router.post(
  "/decrement",
  verifyTokenAndAuthorization,
  cartController.decrementProductQuantity
);

/**
 * DELETE /api/cart/delete/:id
 * @description Removes a product from the user's cart by product ID.
 * @route {DELETE} /api/cart/delete/:id
 * @access Private
 */
router.delete(
  "/delete/:id",
  verifyTokenAndAuthorization,
  cartController.removeProductFromCart
);

/**
 * GET /api/cart
 * @description Fetches all products in the user's cart.
 * @route {GET} /api/cart
 * @access Private
 */
router.get("/", verifyTokenAndAuthorization, cartController.fetchUserCart);

/**
 * GET /api/cart/count
 * @description Retrieves the count of items in the user's cart.
 * @route {GET} /api/cart/count
 * @access Private
 */
router.get("/count", verifyTokenAndAuthorization, cartController.getCartCount);

/**
 * DELETE /api/cart/clear
 * @description Clears all products from the user's cart.
 * @route {DELETE} /api/cart/clear
 * @access Private
 */
router.delete(
  "/clear",
  verifyTokenAndAuthorization,
  cartController.clearUserCart
);

module.exports = router;
