const Order = require("../models/Order");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Restaurant = require("../models/Restaurant");

module.exports = {
  /**
   * Places a new order in the system.
   *
   * This function processes the order details from the request body, including the order items and their additives.
   * It then creates a new order in the database and returns the created order data in the response.
   * If the order is placed successfully, a success message with the order data is sent as a response.
   * If there is an error, an error message is returned.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request containing the order details.
   * @param {string} req.body.userId - The ID of the user placing the order.
   * @param {Object} req.body.deliveryAddress - The delivery address for the order.
   * @param {Array} req.body.orderItems - A list of order items with details such as food ID, quantity, and additives.
   * @param {number} req.body.orderTotal - The total amount for the order.
   * @param {string} req.body.orderStatus - The status of the order (e.g., "Placed").
   * @param {string} req.body.paymentStatus - The payment status (e.g., "Pending").
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  placeOrder: async (req, res) => {
    try {
      // Iterate over order items and construct additives subdocuments
      const orderItems = (req.body.orderItems || []).map((orderItem) => ({
        ...orderItem,
        additives: (orderItem.additives || []).map((additive) => ({
          id: additive.id,
          title: additive.title,
          price: additive.price,
        })),
      }));

      // Create the order object
      const orderData = {
        ...req.body,
        orderItems,
      };

      // Create and save the new order in the database
      const order = new Order(orderData);
      await order.save();
      console.log("[orderController.placeOrder]: Order details = ", order);

      // Return success response
      res.status(201).json({
        status: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      console.log("[orderController.placeOrder]: Error = ", error);

      res.status(500).json({
        status: false,
        message: "Failed to place order.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves detailed information for a specific order.
   *
   * This function fetches an order from the database by its ID and populates related data,
   * including the user's details, delivery address, restaurant information, and assigned driver details.
   * If the order exists, it returns the populated order details. If not, it responds with an appropriate error message.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {string} req.params.id - The ID of the order to retrieve.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getOrderDetails: async (req, res) => {
    const orderId = req.params.id;

    try {
      // Find the order and populate related data
      const order = await Order.findById(orderId)
        .populate({
          path: "userId",
          select: "name email", // Include user's name and email
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 city state postalCode latitude longitude", // Include specific delivery address fields
        })
        .populate({
          path: "restaurantId",
          select: "name location", // Include restaurant's name and location
        })
        .populate({
          path: "driverId",
          select: "name phone", // Include driver's name and phone
        });

      if (order) {
        res.status(200).json({ status: true, data: order });
      } else {
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get order details",
        error: error.message,
      });
    }
  },

  /**
   * Deletes a specific order by its ID.
   *
   * This function removes an order from the database using its ID. If the operation
   * is successful, it responds with a success message. If an error occurs during the
   * process, it responds with an error message.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.id - The ID of the order to delete.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  deleteOrder: async (req, res) => {
    const orderId = req.params.id;

    try {
      await Order.findByIdAndDelete(orderId);
      res
        .status(200)
        .json({ status: true, message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to delete order.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves all orders placed by the authenticated user.
   *
   * This function fetches all orders associated with the currently authenticated user.
   * The results include populated details of the associated restaurant and driver
   * for each order. On successful retrieval, it responds with the list of orders.
   * In case of an error, it logs the error and returns an appropriate response.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.user - The authenticated user object.
   * @param {string} req.user.id - The ID of the authenticated user.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getUserOrders: async (req, res) => {
    const userId = req.user.id;
    try {
      const orders = await Order.find({ userId })
        .populate("restaurantId")
        .populate("driverId");
      res.status(200).json({ status: true, data: orders });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get users orders.",
        error: error.message,
      });
    }
  },

  /**
   * Adds a rating and feedback to a specific order.
   *
   * This function allows the authenticated user to rate a completed order and provide feedback.
   * It updates the `rating` and `feedback` fields of the specified order. If the order is successfully
   * updated, the function returns the updated order details along with a success message.
   * If the order is not found, it returns a `404` response. In case of an error, it returns a `500` response.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.id - The ID of the order to be rated.
   * @param {Object} req.body - The request body containing rating and feedback.
   * @param {number} req.body.rating - The rating given to the order (e.g., 1-5).
   * @param {string} req.body.feedback - The feedback message for the order.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  rateOrder: async (req, res) => {
    const orderId = req.params.id;
    const { rating, feedback } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { rating, feedback },
        { new: true }
      );
      if (updatedOrder) {
        res.status(200).json({
          status: true,
          message: "Rating and feedback added successfully",
          data: updatedOrder,
        });
      } else {
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to rate order.",
        error: error.message,
      });
    }
  },

  /**
   * Updates the status of a specific order.
   *
   * This function allows authorized users to update the status of an order using its `orderId`.
   * It modifies the `orderStatus` field of the specified order. On successful update, the function
   * returns the updated order details along with a success message. If the order is not found,
   * it returns a `404` response. In case of an error, it returns a `500` response.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.id - The ID of the order to be updated.
   * @param {Object} req.body - The request body containing the new status.
   * @param {string} req.body.orderStatus - The updated status of the order (e.g., "Pending", "In Progress", "Completed").
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  updateOrderStatus: async (req, res) => {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
      );
      if (updatedOrder) {
        res.status(200).json({
          status: true,
          message: "Order status updated successfully",
          data: updatedOrder,
        });
      } else {
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to update order status.",
        error: error.message,
      });
    }
  },

  /**
   * Updates the payment status of a specific order.
   *
   * This function allows authorized users to update the payment status of an order using its `orderId`.
   * It modifies the `paymentStatus` field of the specified order. On successful update, the function
   * returns the updated order details along with a success message. If the order is not found, it returns
   * a `404` response. In case of an error, it returns a `500` response.
   *
   * @param {Object} req - The request object.
   * @param {string} req.params.id - The ID of the order to be updated.
   * @param {Object} req.body - The request body containing the new payment status.
   * @param {string} req.body.paymentStatus - The updated payment status of the order (e.g., "Pending", "Completed", "Failed").
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  updatePaymentStatus: async (req, res) => {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
      );
      if (updatedOrder) {
        res.status(200).json({
          status: true,
          message: "Payment status updated successfully",
          data: updatedOrder,
        });
      } else {
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to update payment status.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a list of orders for a specific restaurant based on order status.
   *
   * This function fetches orders from the database for a specified restaurant (`restaurantId`)
   * and filters them by the provided `status` query parameter. It also filters orders with
   * `paymentStatus` as either "Completed" or "Pending." The function returns detailed information
   * about the orders, including the user, delivery address, order items, and restaurant details.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.query - The query parameters of the request.
   * @param {string} req.query.status - The status of the orders to retrieve (e.g., "placed", "preparing").
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the restaurant for which to retrieve orders.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getRestaurantOrdersList: async (req, res) => {
    // Map query status to database values
    const statusMap = {
      placed: "Placed",
      preparing: "Preparing",
      ready: "Ready",
      out_for_delivery: "Out_for_Delivery",
      delivered: "Delivered",
      manual: "Manual",
      cancelled: "Cancelled",
    };

    const status = statusMap[req.query.status];
    console.log(
      `[orderController.getRestaurantOrdersList]: `,
      `Requested status: ${req.query.status}, Resolved status: ${status}, Restaurant ID: ${req.params.id}`
    );

    try {
      // Fetch orders matching the criteria
      const parcels = await Order.find({
        orderStatus: status,
        restaurantId: req.params.id,
        $or: [{ paymentStatus: "Completed" }, { paymentStatus: "Pending" }],
      })
        .select(
          "userId deliveryAddress orderItems deliveryFee restaurantId orderStatus restaurantCoords recipientCoords paymentStatus"
        )
        .populate({
          path: "userId",
          select: "phone profile",
        })
        .populate({
          path: "restaurantId",
          select: "title imageUrl logoUrl time",
        })
        .populate({
          path: "orderItems.foodId",
          select: "title imageUrl time",
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 latitude longitude",
        });

      // Respond with the retrieved orders
      res.status(200).json({
        status: true,
        data: parcels,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get restaurant orders list.",
        error: error.message,
      });
    }
  },

  /**
   * Processes an order by updating its status and optionally sends notifications to the user.
   *
   * This function updates the status of an order (e.g., Preparing, Ready, Out for Delivery, Delivered, Cancelled)
   * and handles relevant operations such as sending notifications or updating restaurant earnings for delivered orders.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the order to process.
   * @param {string} req.params.status - The new status to set for the order.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  processOrder: async (req, res) => {
    const orderId = req.params.id;
    const status = req.params.status;

    console.log(
      "[orderController.processOrder]",
      `Processing order: ${orderId}, New Status: ${status}`
    );

    try {
      // Update the order's status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: status },
        { new: true }
      )
        .select(
          "userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus"
        )
        .populate({
          path: "userId",
          select: "phone profile", // Retrieves user details
        })
        .populate({
          path: "restaurantId",
          select: "title coords imageUrl logoUrl time", // Retrieves restaurant details
        })
        .populate({
          path: "orderItems.foodId",
          select: "title imageUrl time", // Retrieves food item details
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 city district", // Retrieves delivery address details
        });

      if (!updatedOrder) {
        console.error(
          `[orderController.processOrder]: Order not found: ${orderId}`
        );
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      // Optional: Handle user notifications based on the status
      // const user = await User.findById(updatedOrder.userId._id, { fcm: 1 });
      // if (user?.fcm) {
      //   const data = {
      //     orderId: updatedOrder._id.toString(),
      //     messageType: "order",
      //   };

      //   switch (status) {
      //     case "Preparing":
      //       sendNotification(
      //         user.fcm,
      //         "👩‍🍳 Order Accepted and Preparing",
      //         data,
      //         "Your order is being prepared and will be ready soon."
      //       );
      //       break;
      //     case "Ready":
      //       sendNotificationToTopic(data);
      //       sendNotification(
      //         user.fcm,
      //         "🚚 Order Awaits Pick Up",
      //         data,
      //         "Your order is ready and waiting to be picked up."
      //       );
      //       break;
      //     case "Out_for_Delivery":
      //     case "Manual":
      //       sendNotification(
      //         user.fcm,
      //         "🚚 Order Picked Up and Out for Delivery",
      //         data,
      //         "Your order has been picked up and is on its way."
      //       );
      //       break;
      //     case "Delivered":
      //       await Restaurant.findByIdAndUpdate(
      //         updatedOrder.restaurantId._id,
      //         { $inc: { earnings: updatedOrder.orderTotal } },
      //         { new: true }
      //       );
      //       sendNotification(
      //         user.fcm,
      //         "🎊 Food Delivered 🎉",
      //         data,
      //         "Thank you for ordering from us! Your order has been successfully delivered."
      //       );
      //       break;
      //     case "Cancelled":
      //       sendNotification(
      //         user.fcm,
      //         "💔 Order Cancelled",
      //         data,
      //         "Your order has been cancelled. Contact the restaurant for more information."
      //       );
      //       break;
      //     default:
      //       console.log(`Unhandled status: ${status}`);
      //   }
      // }

      // Respond with the updated order
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to process order.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a list of nearby orders based on the order status and payment status.
   *
   * This function fetches orders from the database where the `orderStatus` matches
   * the provided status parameter and the `paymentStatus` is "Completed." It populates
   * related fields for user, restaurant, order items, and delivery address to provide
   * detailed order information.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.status - The status of the orders to retrieve (e.g., "Ready").
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getNearbyOrders: async (req, res) => {
    try {
      console.log(
        `[orderController.getNearbyOrders]: Status = ${req.params.status}`
      );
      // Query to find orders matching the given criteria
      const parcels = await Order.find({
        orderStatus: req.params.status,
        paymentStatus: "Completed",
      })
        .select(
          "userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus"
        )
        .populate({
          path: "userId",
          select: "phone profile", // Retrieves phone and profile fields for the user
        })
        .populate({
          path: "restaurantId",
          select: "title coords imageUrl logoUrl time", // Retrieves restaurant details
        })
        .populate({
          path: "orderItems.foodId",
          select: "title imageUrl time", // Retrieves food item details
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 city district latitude longitude", // Retrieves delivery address details
        });

      // Log the retrieved parcels for debugging
      console.log("[orderController.getNearbyOrders]: Parcels = ", parcels);

      // Respond with the retrieved parcels
      res.status(200).json({
        status: true,
        data: parcels,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get nearby orders.",
        error: error.message,
      });
    }
  },

  /**
   * Assigns a driver to an order and updates the order status to "Out for Delivery."
   *
   * This function updates an order with the provided `orderId` by assigning a driver
   * (specified by the `driver` parameter) and changing the `orderStatus` to "Out for Delivery."
   * It retrieves and populates related fields, including user, restaurant, order items, and delivery address.
   * Additionally, it fetches the user's FCM token for potential notification functionality.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the order to be updated.
   * @param {string} req.params.driver - The ID of the driver to be assigned.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  addDriver: async (req, res) => {
    const orderId = req.params.id;
    const driver = req.params.driver;

    try {
      console.log(
        "[orderController.addDriver]: ",
        `Assigning order ${orderId} to driver ${driver}`
      );

      // Update the order with the new driver and status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: "Out_for_Delivery", driverId: driver },
        { new: true }
      )
        .select(
          "userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus"
        )
        .populate({
          path: "userId",
          select: "phone profile fcm", // Retrieves user phone, profile, and FCM token
        })
        .populate({
          path: "restaurantId",
          select: "title coords imageUrl logoUrl time", // Retrieves restaurant details
        })
        .populate({
          path: "orderItems.foodId",
          select: "title imageUrl time", // Retrieves food item details
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 city district", // Retrieves delivery address details
        });

      // Fetch the FCM token for the user
      const user = updatedOrder
        ? await User.findById(updatedOrder.userId._id, { fcm: 1 })
        : null;

      if (updatedOrder) {
        // Placeholder for notification functionality
        // Uncomment and implement the following block as needed:
        // if (user?.fcm) {
        //     const data = {
        //         orderId: updatedOrder._id.toString(),
        //         messageType: "order",
        //     };
        //     const db = admin.database();
        //     sendNotification(
        //         user.fcm,
        //         "🚚 Order Picked Up and Out for Delivery",
        //         data,
        //         "Your order has been picked up and is now being delivered."
        //     );
        // }
        // updateUser(updatedOrder, db, status);

        console.log(
          "[orderController.addDriver]: Order successfully updated = ",
          updatedOrder
        );
        res.status(200).json(updatedOrder);
      } else {
        console.error(
          "[orderController.addDriver]: Order not found = ",
          orderId
        );
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to add driver.",
        error: error.message,
      });
    }
  },

  /**
   * Retrieves a list of orders picked up by a specific driver and filtered by order status.
   *
   * This function fetches orders based on their `orderStatus` and `driverId` parameters.
   * It populates related fields, including user details, restaurant details, order items, and delivery address.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.status - The status of the orders to retrieve ("Out_for_Delivery", "Delivered", "Manual", or "Cancelled").
   * @param {string} req.params.driver - The ID of the driver assigned to the orders.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  getPickedOrders: async (req, res) => {
    // Map the status from the request parameters to ensure valid input
    const validStatuses = [
      "Out_for_Delivery",
      "Delivered",
      "Manual",
      "Cancelled",
    ];
    const status = validStatuses.includes(req.params.status)
      ? req.params.status
      : "Cancelled";

    console.log("[orderController.getPickedOrders]: Status = ", status);
    console.log(
      "[orderController.getPickedOrders]: Driver = ",
      req.params.driver
    );

    try {
      // Fetch orders based on status and driverId
      const parcels = await Order.find({
        orderStatus: status,
        driverId: req.params.driver,
      })
        .select(
          "userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus"
        )
        .populate({
          path: "userId",
          select: "phone profile", // Retrieves user phone and profile details
        })
        .populate({
          path: "restaurantId",
          select: "title coords imageUrl logoUrl time", // Retrieves restaurant details
        })
        .populate({
          path: "orderItems.foodId",
          select: "title imageUrl time", // Retrieves food item details
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1", // Retrieves delivery address details
        });

      // Respond with the retrieved orders
      res.status(200).json(parcels);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to get picked orders.",
        error: error.message,
      });
    }
  },

  /**
   * Marks an order as delivered and updates related entities.
   *
   * This function updates the status of an order to "Delivered" and adjusts
   * the earnings for the restaurant and driver. It optionally supports notifications
   * to the user and database updates (commented out for future implementation).
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.id - The ID of the order to mark as delivered.
   * @param {Object} req.user - The authenticated user's information.
   * @param {string} req.user.id - The ID of the driver marking the order as delivered.
   * @param {Object} res - The response object.
   *
   * @returns {Object} A JSON response
   */
  markAsDelivered: async (req, res) => {
    const orderId = req.params.id;
    const status = "Delivered";
    const userId = req.user.id;

    try {
      // Update the order's status to "Delivered"
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: status },
        { new: true }
      )
        .select(
          "userId orderTotal deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus"
        )
        .populate({
          path: "userId",
          select: "phone profile fcm", // Retrieves user details
        })
        .populate({
          path: "restaurantId",
          select: "title coords imageUrl logoUrl time", // Retrieves restaurant details
        })
        .populate({
          path: "orderItems.foodId",
          select: "title imageUrl time", // Retrieves food item details
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1", // Retrieves delivery address details
        });

      if (updatedOrder) {
        // Update restaurant earnings
        const restaurantUpdateResult = await Restaurant.findByIdAndUpdate(
          updatedOrder.restaurantId._id,
          { $inc: { earnings: updatedOrder.orderTotal } },
          { new: true }
        );

        console.log(
          `[orderController.markAsDelivered]: Updated restaurant earnings = ${JSON.stringify(
            restaurantUpdateResult
          )}`
        );

        // Update driver earnings and delivery count
        const driver = await Driver.findOne({ driver: userId });
        // console.log(`[orderController.markAsDelivered]: Found driver = ${JSON.stringify(driver)}`);
        if (driver) {
          driver.totalDeliveries += 1;
          driver.totalEarnings += updatedOrder.deliveryFee;
          await driver.save();
          // console.log(`[orderController.markAsDelivered]: Updated driver = ${JSON.stringify(driver)}`);
        }

        // Optional: Send notifications and update the database (currently commented out)

        // const db = admin.database();
        // updateRestaurant(updatedOrder, db, status);
        // updateUser(updatedOrder, db, status);

        // const user = await User.findById(updatedOrder.userId._id, { fcm: 1 });
        // console.log(`Found user: ${JSON.stringify(user)}`);

        // if (user && user.fcm) {
        //   sendNotification(
        //     user.fcm,
        //     "🎊 Food Delivered 🎉",
        //     data,
        //     `Thank you for ordering from us! Your order has been successfully delivered.`
        //   );
        //   console.log(`Notification sent to user: ${user._id}`);
        // }

        // Respond with the updated order
        res.status(200).json(updatedOrder);
      } else {
        console.log("[orderController.markAsDelivered]: Order not found");
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Failed to mark as delivered.",
        error: error.message,
      });
    }
  },
};
