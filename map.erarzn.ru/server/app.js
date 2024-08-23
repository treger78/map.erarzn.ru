const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

connection.query("SELECT * FROM user", (error, res) => {
    if (error) console.error(error);

    console.log(res);
});

/*
connection.connect((error) => {
    if (error) return console.error("Error: " + error.message);

    console.log("Connected");
    console.log()
});

connection.end((error) => {
    if (error) return console.error("Error: " + error.message);

    console.log("Closed");
});
*/

/*
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello");
})

server.listen(3000, () => {
    console.log("Сервер начал прослушивание запросов на порту 3000");
});
*/
