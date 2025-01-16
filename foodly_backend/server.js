// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const restRoute = require("./routes/restaurant");
const catRoute = require("./routes/category");
const foodRoute = require("./routes/food");
const cartRoute = require("./routes/cart");
const addressRoute = require("./routes/address");
const driverRoute = require("./routes/driver");
const orderRoute = require("./routes/order");
const ratingRoute = require("./routes/rating");

// Import utilities
const { fireBaseConnection } = require("./utils/fbConnect");
const dataBaseConnection = require("./utils/mongoConn");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Establish database and Firebase connections
fireBaseConnection();
dataBaseConnection();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base path for API routes
const apiRouter = express.Router();

// Use routes with base paths
apiRouter.use("/auth", authRoute); // Authentication routes
apiRouter.use("/user", userRoute); // User routes
apiRouter.use("/restaurant", restRoute); // Restaurant routes
apiRouter.use("/category", catRoute); // Category routes
apiRouter.use("/foods", foodRoute); // Food routes
apiRouter.use("/cart", cartRoute); // Cart routes
apiRouter.use("/address", addressRoute); // Address routes
apiRouter.use("/driver", driverRoute); // Driver routes
apiRouter.use("/orders", orderRoute); // Order routes
apiRouter.use("/rating", ratingRoute); // Rating routes

// Mount API router
app.use("/api", apiRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

// Start server
const ip = process.env.IP || "localhost";
const port = process.env.PORT || 6000;

app.listen(port, ip, () => {
  console.log(`🚀 Server running at http://${ip}:${port}`);
});
