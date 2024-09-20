const sqlite = require('sqlite3').verbose(); // importing sqlite3 module
const path = require('path'); // importing path module

// opening or creating the database
const dbpath = path.join(__dirname, 'users.db'); // connecting the database to the 
const db =  new sqlite.Database(dbpath, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Successfully connected to the database.");
    }
});