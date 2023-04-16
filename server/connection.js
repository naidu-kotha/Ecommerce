const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "batman",
  database: "ecommerce",
});

module.exports = connection;
