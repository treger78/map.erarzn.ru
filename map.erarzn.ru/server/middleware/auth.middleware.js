const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const CONSTS = require('../utils/constants');

//Middleware для проверки JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.user?.token;

    if (!token) {
        return res.status(403).json({ message: 'Требуется авторизация!', messageColor: CONSTS.colors.red });
    }

    jwt.verify(token, process.env.EXPRESS_SESSION_SECRET, (error, decoded) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Токен истек!', messageColor: CONSTS.colors.red });
            }
            
            return res.status(401).json({ message: 'Неверный токен авторизации!', messageColor: CONSTS.colors.red });
        }

        req.user = decoded;

        next();
    });
};

module.exports = verifyToken;
