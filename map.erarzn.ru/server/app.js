const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const CONSTS = require('./utils/constants');
const sequelize = require('./config/database');
const User = require('./models/User');
const verifyToken = require('./middleware/auth.middleware');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '..', 'client')));

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
    return res.json({ success: true, message: 'Welcome to the personal route!', messageColor: CONSTS.colors.red, user: req.user });
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
                  messageColor: CONSTS.colors.red
                });
            }

            const { name, email, phone, password, repeatedPassword, about } = req.body;

            if (password !== repeatedPassword) {
                return res.status(400).json({ message: 'Введенные пароли не совпадают!', messageColor: CONSTS.colors.red });
            }

            const candidate = await User.findOne({ where: { login: email } });

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует!', messageColor: CONSTS.colors.yellow });
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
            //res.status(201).json({ success: true,  message: 'Пользователь создан, авторизуйтесь!', messageColor: CONSTS.colors.green });
            return res.redirect('/');
        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.', messageColor: CONSTS.colors.red });
        }
    }
);

app.post(
    '/signin',
    async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Введите email и пароль!', messageColor: CONSTS.colors.red });
            }
    
            const user = await User.findOne({ where: { login: email } });

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден!', messageColor: CONSTS.colors.red });
            }

            const isMatch = await bcrypt.compare(password, user.password) || (password === user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверны email или пароль, попробуйте снова!', messageColor: CONSTS.colors.red });
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
                    //httpOnly: true,      // Cookie доступен только серверу
                    secure: true,        // Cookie будет передаваться только через HTTPS
                    sameSite: 'Strict'   // Cookie передается только в пределах того же сайта
                }
            );

            return res.json({
                token,
                userID: user.id,
                email: user.login,
                role: user.role,
                message: `Добро пожаловать, ${user.login}`,
                messageColor: CONSTS.colors.green
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.', messageColor: CONSTS.colors.red });
        }
    }
);

app.get('/signout', (req, res) => {
    //TODO
    return res.clearCookie('user').redirect('/');
});

try {
    sequelize.sync().then(() => {
        //80 - HTTP; //443 - HTTPS //https://nodejsdev.ru/guides/webdraftt/https/
        app.listen(80, () => {
            console.log('listening');
        });
    });   
} catch (error) {
    console.error('Server Error', error);
    process.exit(1);
}
