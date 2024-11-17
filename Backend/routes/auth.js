const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/callback", authController.callback);  // Corrected route

module.exports = router;
