const router = require("express").Router();
const ordersController = require("../controllers/orderController");
const {
  verifyTokenAndAuthorization,
  verifyVendor,
  verifyDriver,
} = require("../middlewares/verifyToken");

/**
 * GET /api/orders/userOrders
 * @description Fetches all orders for a specific user.
 * @route {GET} /api/orders/userOrders
 * @access Private (requires authentication)
 */
router.get(
  "/userOrders",
  verifyTokenAndAuthorization,
  ordersController.getUserOrders
);

/**
 * GET /api/orders/orderslist/:id
 * @description Fetches orders for a specific restaurant by ID.
 * @route {GET} /api/orders/orderslist/:id
 * @access Public
 */
router.get("/orderslist/:id", ordersController.getRestaurantOrdersList);

/**
 * POST /api/orders/rate/:id
 * @description Rates a specific order by ID.
 * @route {POST} /api/orders/rate/:id
 * @access Private (requires authentication)
 */
router.post("/rate/:id", ordersController.rateOrder);

/**
 * POST /api/orders/status/:id
 * @description Updates the status of a specific order by ID.
 * @route {POST} /api/orders/status/:id
 * @access Private (requires authentication)
 */
router.post("/status/:id", ordersController.updateOrderStatus);

/**
 * POST /api/orders/payment-status/:id
 * @description Updates the payment status of a specific order by ID.
 * @route {POST} /api/orders/payment-status/:id
 * @access Private (requires authentication)
 */
router.post("/payment-status/:id", ordersController.updatePaymentStatus);

/**
 * GET /api/orders/delivery/:status
 * @description Fetches nearby orders based on delivery status.
 * @route {GET} /api/orders/delivery/:status
 * @access Public
 */
router.get("/delivery/:status", ordersController.getNearbyOrders);

/**
 * PUT /api/orders/delivered/:id
 * @description Marks an order as delivered (available to drivers).
 * @route {PUT} /api/orders/delivered/:id
 * @access Private (requires driver authentication)
 */
router.put("/delivered/:id", verifyDriver, ordersController.markAsDelivered);

/**
 * PUT /api/orders/process/:id/:status
 * @description Processes an order (available to vendors).
 * @route {PUT} /api/orders/process/:id/:status
 * @access Private (requires vendor authentication)
 */
router.put("/process/:id/:status", verifyVendor, ordersController.processOrder);

/**
 * PUT /api/orders/picked-orders/:id/:driver
 * @description Assigns a driver to an order (available to drivers).
 * @route {PUT} /api/orders/picked-orders/:id/:driver
 * @access Private (requires driver authentication)
 */
router.put(
  "/picked-orders/:id/:driver",
  verifyDriver,
  ordersController.addDriver
);

/**
 * GET /api/orders/picked/:status/:driver
 * @description Fetches orders assigned to a specific driver based on status.
 * @route {GET} /api/orders/picked/:status/:driver
 * @access Private (requires driver authentication)
 */
router.get(
  "/picked/:status/:driver",
  verifyDriver,
  ordersController.getPickedOrders
);

/**
 * GET /api/orders/:id
 * @description Fetches the details of a specific order by ID.
 * @route {GET} /api/orders/:id
 * @access Public
 */
router.get("/:id", ordersController.getOrderDetails);

/**
 * DELETE /api/orders/:id
 * @description Deletes a specific order by ID.
 * @route {DELETE} /api/orders/:id
 * @access Private (requires authentication)
 */
router.delete("/:id", ordersController.deleteOrder);

/**
 * POST /api/orders
 * @description Places a new order for a user.
 * @route {POST} /api/orders
 * @access Private (requires authentication)
 */
router.post("/", verifyTokenAndAuthorization, ordersController.placeOrder);

module.exports = router;
