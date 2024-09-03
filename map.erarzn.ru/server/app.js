const dotenv = require("dotenv");
const mysql = require("mysql2");
const express = require("express");
const session = require("express-session");
const path = require("path");

dotenv.config();

const conncectToDB = (DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD) => {
    return mysql.createConnection({
        host: DB_HOST,
        database: DB_DATABASE,
        user: DB_USER,
        password: DB_PASSWORD
    });
};

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.get('*', (req, res) => {
    //res.sendFile(path.resolve('../client/public/map.erarzn.ru.html'));
    //res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'));
    res.render(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'), {
        user: req.session.email
    });
});

app.post('/signin', (req, res) => {
    const email = req.body["e-mail"];
    const password = req.body.password;

    if (!email || !password) {
        res.send("Введите e-mail и пароль!");
        res.end();
    }

    const connection = conncectToDB(process.env.DB_HOST, process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD);

    connection.query("SELECT * FROM user WHERE login=? AND password=?", [email, password], (error, data) => {
        if (error) {
            console.error(error);
            throw error;
        }

        if (data.length > 0) {
            req.session.isAuthenticated = true;
            req.session.email = email;

            res.redirect('/');
        } else {
            res.send('Неверный e-mail или пароль!');
        }

        res.end();
    });

    connection.end((error) => {
        if (error) return console.error("Error: " + error.message);
    });
});

app.listen(3000, () => {
    console.log("listening");
});
