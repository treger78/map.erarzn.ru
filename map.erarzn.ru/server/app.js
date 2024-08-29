const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.get("*", (_, res) => {
    //res.sendFile(path.resolve('../client/public/map.erarzn.ru.html'));
    res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'map.erarzn.ru.html'));
});

app.listen(3000, () => {
    console.log("listening");
});

/*

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
*/

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
