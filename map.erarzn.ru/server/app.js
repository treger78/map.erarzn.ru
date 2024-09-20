const dotenv = require("dotenv");
const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.EXPRESS_SESSION_SECRET
};
  
passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    const user = getUser(jwtPayload.email);

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

app.use(passport.initialize());

app.use('/', express.static(path.join(__dirname, '..', 'client')));

//TODO: email or login???
function createUser(email, password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    return { email, hashedPassword }
}

app.get('*', (req, res) => {
    //res.sendFile(path.resolve('../client/public/index.ejs'));
    //res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'));
    res.render(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'), {
        //!!!!
        //user: req.session.email
        user: undefined
    });
});

app.post('/signup', (req, res) => {
    const { name, email, phone, password, repeatedPassword, about } = req.body;

    //TODO: добавить валидацию и проверку на уже существующего юзера в БД

    const user = createUser(email, password);

    const connection = conncectToDB(process.env.DB_HOST, process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD);

    //login === email
    connection.query(
        `
            INSERT INTO user (name, login, password, email, phone, role, about, ban) VALUES
                ('${name}', '${user.email}', '${user.hashedPassword}', '${user.email}', '${phone}', 10, '${about}', 0)
        `,
        (error, data) => {
            if (error) {
                console.error(error);
                throw error;
            }

            //TODO: !не возвращать user
            res.json({ success: true, user });
            res.redirect('/');    
            res.end();
        }
    );

    connection.end((error) => {
        if (error) return console.error("Error: " + error.message);
    });
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.send("Введите email и пароль!");
        res.end();
    }

    const connection = conncectToDB(process.env.DB_HOST, process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD);

    connection.query("SELECT * FROM user WHERE login=?", [email], (error, data) => {
        if (error) {
            console.error(error);
            throw error;
        }

        //TODO
        if (data.length > 0 && (/*bcrypt.compareSync(password, data[0].password) || */password === data[0].password)) {            
            const token = jwt.sign({ email: data.email }, jwtOptions.secretOrKey);

            //req.session.isAuthenticated = true;
            //req.session.email = email;

            res.json({ success: true, token });
            //res.redirect('/');
        } else {
            res.status(401).json({ success: false, message: 'Неверный email или пароль!' });
            //res.send('Неверный email или пароль!');
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
