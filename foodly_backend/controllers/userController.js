const User = require("../models/User");

module.exports = {
  getUser: async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(
        { _id: userId },
        { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
      );
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "error retrieving user", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.user.id;
    try {
      await User.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ status: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "error deleting user" });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.user.id;

    try {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res
        .status(200)
        .json({ status: true, message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "error updating user" });
    }
  },
};
