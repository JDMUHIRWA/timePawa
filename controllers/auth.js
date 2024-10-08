const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const { parse } = require("dotenv");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Register a new user
exports.register = (req, res) => {
  console.log(req.body);
  const { username, password, ConfirmPassword } = req.body;

  db.query(
    "SELECT username FROM users WHERE username = ?",
    [username],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          message: "Username already taken",
        });
      } else if (password !== ConfirmPassword) {
        return res.render("register", {
          message: "Passwords do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO users SET ?",
        { username: username, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("register", {
              message: "User registered",
            });
          }
        }
      );
    }
  );
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("login", {
        message: "Please enter both username and password.",
      });
    }

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          return res.status(401).render("login", {
            message: "Username or password is incorrect",
          });
        } else {
          const id = results[0].id;

          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("The token is: " + token);

          const cookieExpires = process.env.JWT_COOKIE_EXPIRES || 7;

          const cookieOptions = {
            expires: new Date(
              Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);

          //Render the home page
          return res.redirect("/home");
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).render("login", {
      message: "An error occurred during login.",
    });
  }
};
