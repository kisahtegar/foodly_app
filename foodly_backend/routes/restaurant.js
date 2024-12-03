const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");
const {
  verifyAndAuthorization,
  verifyVendor,
} = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, restaurantController.addRestaurant);

router.get("/byId/:id", restaurantController.getRestaurant);

router.get("/:code", restaurantController.getRandomRestaurants);

router.delete("/:id", verifyVendor, restaurantController.deleteRestaurant);

router.patch("/:id", verifyVendor, restaurantController.serviceAvaibility);

module.exports = router;
