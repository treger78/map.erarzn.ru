const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = User;
