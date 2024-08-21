const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

connection.connect((error) => {
    if (error) return console.error("Error: " + error.message);

    console.log("Connected");
});

connection.end((error) => {
    if (error) return console.error("Error: " + error.message);

    console.log("Closed");
});

/*
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello");
})

server.listen(3000, () => {
    console.log("Сервер начал прослушивание запросов на порту 3000");
});
*/
