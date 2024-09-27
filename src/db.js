// Import the mysql package
const mysql = require("mysql");

// Create a connection object
const connection = mysql.createConnection({
  host: "localhost", // Replace with your MySQL host
  user: "root", // Replace with your MySQL user
  password: "", // Replace with your MySQL password
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("MySQL is not installed or not running:", err.message);
  } else {
    console.log("MySQL is installed and connection established!");
  }

  // Close the connection
  connection.end();
});
