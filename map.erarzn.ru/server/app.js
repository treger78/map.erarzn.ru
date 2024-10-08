const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const CONSTS = require('./utils/constants');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '..', 'client')));

//Middleware для проверки JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.user?.token;

    if (!token) {
        //TODO
        return res.status(403).json({ message: 'Требуется авторизация!' });
    }

    jwt.verify(token, process.env.EXPRESS_SESSION_SECRET, (error, decoded) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                //TODO
                return res.status(401).json({ message: 'Токен истек!' });
            }
            
            //TODO
            return res.status(401).json({ message: 'Неверный токен авторизации!' });
        }

        req.user = decoded;

        next();
    });
};

//'*'
app.get('/', (req, res) => {
    const user = req.cookies.user?.email || undefined;

    //res.sendFile(path.resolve('../client/public/index.ejs'));
    //res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'));
    res.render(path.resolve(__dirname, '..', 'client', 'public', 'index.ejs'), {
        user: user
    });
});

app.get('/personal', verifyToken, (req, res) => {
    //TODO
    return res.json({ success: true, message: 'Welcome to the personal route!', user: req.user });
});

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
                //TODO
                res.status(400).json({ message: 'Введенные пароли не совпадают!' });
            }

            const candidate = await User.findOne({ where: { login: email } });

            if (candidate) {
                //TODO
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

            //TODO
            //res.status(201).json({ success: true,  message: 'Пользователь создан, авторизуйтесь!' });
            res.redirect('/');
        } catch (error) {
            //TODO
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
                //TODO
                res.send('Введите email и пароль!');
                res.end();
            }
    
            const user = await User.findOne({ where: { login: email } });

            if (!user) {
                //TODO
                return res.status(400).json({ message: 'Пользователь не найден!' });
            }

            const isMatch = await bcrypt.compare(password, user.password) || (password === user.password);

            if (!isMatch) {
                //TODO
                return res.status(400).json({ message: 'Неверны email или пароль, попробуйте снова!' });
            }

            const token = jwt.sign(
                {
                    userID: user.id,
                    email: user.login,
                    role: user.role,
                },
                process.env.EXPRESS_SESSION_SECRET,
                { expiresIn: '30d' }
            );

            res.cookie(
                'user',
                {
                    token: token,
                    userID: user.id,
                    email: user.login,
                    role: user.role,
                },
                {
                    httpOnly: true,      // Cookie доступен только серверу
                    secure: true,        // Cookie будет передаваться только через HTTPS
                    sameSite: 'Strict'   // Cookie передается только в пределах того же сайта
                }
            );

            return res.redirect('/');
        } catch (error) {
            console.error(error);
            //TODO
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.' });
        }
    }
);

app.get('/signout', (req, res) => {
    return res.clearCookie('user').redirect('/');
});

try {
    sequelize.sync().then(() => {
        //TODO: сделать process.env production & develop для корректной настройки порта
        app.listen(3000, () => {
            console.log('listening');
        });
    });   
} catch (error) {
    console.error('Server Error', error);
    process.exit(1);
}
