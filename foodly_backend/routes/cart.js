const router = require("express").Router();
const cartControlller = require("../controllers/cartController");
const { verifyAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, cartControlller.addProductToCart);

router.post(
  "/decrement",
  verifyAndAuthorization,
  cartControlller.decrementProductQty
);

router.delete(
  "/delete/:id",
  verifyAndAuthorization,
  cartControlller.removeProductFromCart
);

router.get("/", verifyAndAuthorization, cartControlller.fetchUserCart);

router.get("/count", verifyAndAuthorization, cartControlller.getCartCount);

router.delete("/clear", verifyAndAuthorization, cartControlller.clearUserCart);

module.exports = router;
