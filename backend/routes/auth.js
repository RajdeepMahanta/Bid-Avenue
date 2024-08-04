const express = require("express");

const userController = require("../controllers/authController");

const router = express.Router();
router.post("/createuser", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
