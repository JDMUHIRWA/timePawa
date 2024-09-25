const express = require('express');
const app = express();
const sqlite3 = require("sqlite3").verbose();
let sql;

//check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})