const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/login", (req, res) => {
  res.render("Login");
});

router.get("/register", (req, res) => {
  res.render("Register");
});

module.exports = router;
