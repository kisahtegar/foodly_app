const Cart = require("../models/Cart");

module.exports = {
  /**
   * Adds a product to the user's cart. If the product already exists in the cart,
   * the quantity and total price are updated. If the product does not exist,
   * a new entry is created in the cart.
   *
   * @param {Object} req - The request object containing the user's ID, product ID,
   *                       quantity, and total price for the product to be added.
   * @param {Object} res - The response object to send the status of the operation.
   *
   * @returns {Object} - A response containing the status of the operation and
   *                     the updated cart count.
   */
  addProductToCart: async (req, res) => {
    const userId = req.user.id; // Extract the user ID from the request
    const { productId, additives, instructions, totalPrice, quantity } =
      req.body;
    let count;

    try {
      // Check if the product already exists in the cart for the user
      const existingProduct = await Cart.findOne({ userId, productId });
      count = await Cart.countDocuments({ userId });

      if (existingProduct) {
        // If the product exists, update the quantity and total price
        existingProduct.quantity += 1;
        existingProduct.totalPrice += totalPrice;
        await existingProduct.save(); // Save the updated cart entry
      } else {
        // If the product does not exist, create a new entry in the cart
        const newCartEntry = new Cart({
          userId: userId,
          productId: productId,
          additives: additives,
          instructions: instructions,
          totalPrice: totalPrice,
          quantity: quantity,
        });
        await newCartEntry.save();
        count = await Cart.countDocuments({ userId }); // Get the updated cart count
      }

      // Respond with the status and updated cart count
      res.status(201).json({ status: true, count: count });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({
        status: false,
        message: "Failed to add product to cart",
        error: error.message,
      });
    }
  },

  /**
   * Removes a product from the user's cart based on the provided item ID.
   * The cart item is deleted, and the updated cart count is returned.
   *
   * @param {Object} req - The request object containing the item ID from the
   *                       route parameter and the user ID from the request.
   * @param {Object} res - The response object to send the status of the operation.
   *
   * @returns {Object} - A response containing the status of the operation and
   *                     the updated cart count.
   */
  removeProductFromCart: async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
      await Cart.findOneAndDelete({ _id: itemId });
      const count = await Cart.countDocuments({ userId });
      res.status(200).json({ status: true, cartCount: count });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to remove product from cart",
        error: error.message,
      });
    }
  },

  /**
   * Fetches the user's cart details, including information about the products
   * in the cart. Each product is populated with fields such as image URL, title,
   * restaurant, rating, and rating count.
   *
   * @param {Object} req - The request object containing the user ID from the
   *                       authenticated user.
   * @param {Object} res - The response object to send the user's cart details.
   *
   * @returns {Object} - A response containing the status of the operation and
   *                     the user's cart details.
   */
  fetchUserCart: async (req, res) => {
    const id = req.user.id;

    try {
      // Retrieve all cart items for the user and populate product details
      const userCart = await Cart.find({ userId: id }).populate({
        path: "productId",
        select: "title imageUrl restaurant rating ratingCount",
      });
      res.status(200).json({ status: true, cart: userCart });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to fetch user cart.",
        error: error.message,
      });
    }
  },

  /**
   * Clears all items from the user's cart.
   * This operation removes all cart entries associated with the given user.
   *
   * @param {Object} req - The request object containing the authenticated user's ID.
   * @param {Object} res - The response object to send a confirmation message.
   *
   * @returns {Object} - A response confirming that the user's cart has been cleared.
   */
  clearUserCart: async (req, res) => {
    const userId = req.user.id;

    try {
      await Cart.deleteMany({ userId });
      res
        .status(200)
        .json({ status: true, message: "User cart cleared successfully" });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to clear user cart.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves the total number of items in the user's cart.
   * This operation counts the number of cart entries associated with the given user.
   *
   * @param {Object} req - The request object containing the authenticated user's ID.
   * @param {Object} res - The response object to send the total item count in the cart.
   *
   * @returns {Object} - A response containing the total item count of the user's cart.
   */
  getCartCount: async (req, res) => {
    const userId = req.user.id;

    try {
      const count = await Cart.countDocuments({ userId });
      res.status(200).json({ status: true, cartCount: count });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get cart count.",
        error: error.message,
      });
    }
  },

  /**
   * Decreases the quantity of a product in the user's cart or removes it entirely
   * if the quantity becomes zero. This operation checks if the cart item exists,
   * adjusts its quantity and price, or removes it from the cart.
   *
   * @param {Object} req - The request object containing the authenticated user's ID and the product ID to decrement.
   * @param {Object} res - The response object to send a success or error message.
   *
   * @returns {Object} - A response indicating the success or failure of the operation.
   */
  decrementProductQuantity: async (req, res) => {
    const userId = req.user.id;
    const productId = req.body.productId;

    try {
      // Find the cart item for the user and product
      const cartItem = await Cart.findOne({ userId, productId });

      if (cartItem) {
        // Calculate the price of a single product by dividing total price by quantity
        const productPrice = cartItem.totalPrice / cartItem.quantity;

        // If quantity is more than 1, decrement and adjust price
        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
          cartItem.totalPrice -= productPrice;
          await cartItem.save();
          res.status(200).json({
            status: true,
            message: "Product quantity decreased successfully",
          });
        }
        // If quantity is 1, remove the item from the cart
        else {
          await Cart.findOneAndDelete({ userId, productId });
          res.status(200).json({
            status: true,
            message: "Product removed from cart",
          });
        }
      } else {
        // If the product is not found in the cart
        res.status(404).json({
          status: false,
          message: "Product not found in cart",
        });
      }
    } catch (error) {
      // Handle any errors that occur during the operation
      res.status(500).json({
        status: false,
        message: "Failed to decrement product quantity.",
        error: error.message,
      });
    }
  },
};
