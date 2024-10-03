const dotenv = require('dotenv');
const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const passport = require('passport');
//const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { CONSTS } = require('./utils/constants');
const { Sequelize, DataTypes } = require('sequelize');
const cookieParser = require('cookie-parser');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        define: {
            timestamps: false,
        }
    }
);

const User = sequelize.define(
    'user',
    {
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(32),
            allowNull: true,
        },
        role: {
            type: DataTypes.TINYINT(2),
            allowNull: false,
            defaultValue: 10,
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ban: {
            type: DataTypes.TINYINT(2),
            allowNull: false,
            defaultValue: 0,
        },        
    },
    {
        tableName: 'user',
    },
);

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.EXPRESS_SESSION_SECRET
};

/*
passport.use('jwt', new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    const user = getUser(jwtPayload.email);

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
}));
*/

//app.use(passport.initialize());

app.use('/', express.static(path.join(__dirname, '..', 'client')));

//'*'
app.get('/', (req, res) => {
    let user = undefined;

    if (req.cookies.user) {
        user = req.cookies.user.email
    }

    //res.sendFile(path.resolve('../client/public/index.ejs'));
    //res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'));
    res.render(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'), {
        user: user
    });
});

/*
app.get('/personal', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ success: true, message: 'Welcome to the personal route!' });
});
*/

app.post(
    '/signup',
    [
        check('name', 'Введите корректное имя!').isLength({ min: 2 }).isString(),
        check('email', 'Некорректный email!').isEmail(),
        check('password', 'Минимальная длина пароля 8 символов!').isLength({ min: 8 }),
        check('repeatedPassword', 'Минимальная длина пароля 8 символов!').isLength({ min: 8 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                  errors: errors.array(),
                  message: 'Некорректные данный при регистрации!',
                });
            }

            const { name, email, phone, password, repeatedPassword, about } = req.body;

            if (password !== repeatedPassword) {
                res.send('Введенные пароли не совпадают!');
                res.end();
            }

            const candidate = await User.findOne({ where: { login: email } });

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10); //10 - saltLength

            const user = new User({
                name: name,
                login: email,
                email: email,
                phone: phone || '',
                password: hashedPassword,
                about: about || '',
                role: CONSTS.role.volunteer, //volunteer = 10; it's default value
                ban: CONSTS.ban.no, //no = not banned = 0, it's default value
            });

            await user.save();

            res.status(201).json({ success: true,  message: 'Пользователь создан, авторизуйтесь!' });
            //res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
            console.error(error);
        }
    }
);

app.post(
    '/signin',
    async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.send('Введите email и пароль!');
                res.end();
            }
    
            const user = await User.findOne({ where: { login: email } });

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден!' });
            }

            const isMatch = await bcrypt.compare(password, user.password) || (password === user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверны email или пароль, попробуйте снова!' });
            }

            const token = jwt.sign(
                {
                    userID: user.id,
                    email: user.login,
                    role: user.role,
                },
                jwtOptions.secretOrKey,
                { expiresIn: '30d' }
            );

            res.cookie('user', {
                token: token,
                userID: user.id,
                email: user.login,
                role: user.role,
            });

            return res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
            console.error(error);    
        }
    }
);

try {
    sequelize.sync().then(() => {
        app.listen(3000, () => {
            console.log('listening');
        });
    });   
} catch (error) {
    console.error('Server Error', error);
    process.exit(1);
}
