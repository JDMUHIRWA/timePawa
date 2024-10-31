const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Hello World");
// });

router.get("/login", (req, res) => {
  res.render("Login");
});

router.get("/register", (req, res) => {
  res.render("Register");
});

router.get("/home", (req, res) => {
  res.render("Home");
});

router.get("/schedule", (req, res) => {
  res.render("Schedule");
});

router.get("/swap", (req, res) => {
  res.render("Swap");
});

router.get("/break", (req, res) => {
  res.render("Break");
});

router.get("/onbreak", (req, res) => {
  res.render("Onbreak");
});

module.exports = router;
