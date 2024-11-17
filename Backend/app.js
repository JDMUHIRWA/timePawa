const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
const passport = require("passport");
const expressSession = require("express-session");
const authRoutes = require("./routes/auth");
const authController = require("./controllers/auth");

dotenv.config({ path: "./.env" });

// Create a new database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Path to public directory for front-end
const publicDirectory = path.join(__dirname, "./public-fn");
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// View engine setup for HTML
app.set("view engine", "hbs");

// Connect to the database
db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err);
  } else {
    console.log("Database connected");
  }
});

// Middleware for session handling
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Use auth routes
app.use("/auth", authRoutes);
app.post("/auth/callback", authController.callback);
app.get("/protected", authController.authSuccess); // Protected route
app.get("/error", (req, res) => {
  console.log("Error page triggered. Session", req.session);
  res.status(500).send("Authentication error");
});

// Use pages routes
app.use("/", require("./routes/pages"));

// Check if the server is running
app.listen(4003, () => {
  console.log("Server is running on port 4003");
});

// Error handler for 404
app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.get("/", (req, res) => {
  res.send("Welcome to timePawa");
});

// Close the server
app.get("/close", (req, res) => {
  res.send("Server is closing");
  process.exit();
});
