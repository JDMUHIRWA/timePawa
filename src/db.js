const sqlite3 = require("sqlite3").verbose();
let sql;

// Open (or create) the SQLite database
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// Create a table
sql = `CREATE TABLE Users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`;
db.run(sql);

//Inserting Users
// sql = `INSERT INTO Users (username, password) VALUES (?, ?)`;
// db.run(sql, ["gustavo", "manzinte"], (err) => {
//   if (err) return console.error(err.message);
// });

//update Users
sql = `UPDATE Users SET username = ? WHERE id = ?`;
db.run(sql, ["axo", 2], (err) => {
  if (err) return console.error(err.message);
});

//delete Users
sql = `DELETE FROM Users WHERE id = ?`;
db.run (sql, [1], (err) =>{
    if (err) return console.error(err.message);
})

// query the database
sql = `SELECT * FROM Users`;
db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
      console.log(row);
    });
})