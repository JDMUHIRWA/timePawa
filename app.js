const express = require('express');
const app = express();
const mysql = require('mysql');

// Create a new database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nodejs-login'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

//check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(4003, () => {
    console.log('Server is running on port 5000');
})

// Close the server
app.get('/close', (req, res) => {
    res.send('Server is closing');
    process.exit();
})