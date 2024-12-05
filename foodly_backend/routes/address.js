const router = require("express").Router();
const addressController = require("../controllers/addressController");
const { verifyAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, addressController.createAddress);

router.delete("/:id", verifyAndAuthorization, addressController.deleteAddress);

router.get(
  "/default",
  verifyAndAuthorization,
  addressController.getDefaultAddress
);

router.get("/", verifyAndAuthorization, addressController.getUserAddresses);

router.put("/:id", verifyAndAuthorization, addressController.updateAddress);

router.post(
  "/default/:id",
  verifyAndAuthorization,
  addressController.setDefaultAddress
);

module.exports = router;
