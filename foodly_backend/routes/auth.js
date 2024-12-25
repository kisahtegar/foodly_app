const router = require("express").Router();
const authController = require("../controllers/authController");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authController.createUser);

/**
 * @route   POST /api/auth/login
 * @desc    Log in a user and return a token
 * @access  Public
 */
router.post("/login", authController.loginUser);

module.exports = router;
