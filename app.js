const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Create a new database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// path to public directory for front-end
const publicDirectory = path.join(__dirname, "./public-fn");
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// view engine setup for HTML
app.set("view engine", "hbs");

// Connect to the database
db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

//check if the server is running
app.get("/login", require("./routes/pages"));
app.get("/register", require("./routes/pages"));
app.get("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(4003, () => {
  console.log("Server is running on port 5000");
});

// Close the server
app.get("/close", (req, res) => {
  res.send("Server is closing");
  process.exit();
});
