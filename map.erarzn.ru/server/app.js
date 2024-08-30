const dotenv = require("dotenv");
const mysql = require("mysql2");
const express = require("express");
const session = require("express-session");
const path = require("path");

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const app = express();

app.use(session({
    secret: 'scrt',
    resave: true,
    saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.get('*', (_, res) => {
    //res.sendFile(path.resolve('../client/public/map.erarzn.ru.html'));
    res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'map.erarzn.ru.html'));
});

app.post('/signin', (req, res) => {
    const email = req.body["e-mail"];
    const password = req.body.password;

    if (!email || !password) {
        res.send("Введите e-mail и пароль!");
        res.end();
    }

    connection.query("SELECT * FROM user WHERE login = ?", [email, password], (error, res) => {
        if (error) {
            console.error(error);
            throw error;
        }

        if (res.length > 0) {
            req.session.loggedin = true;
            req.session.username = email;

            res.redirect('/');
        } else {
            res.send('Неверный e-mail или пароль!');
        }

        res.end();
    });
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
