const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');

const User = sequelize.define(
    'User',
    {
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(32),
            allowNull: true,
            defaultValue: null,
        },
        role: {
            type: DataTypes.TINYINT(2),
            allowNull: true,
            defaultValue: 10,
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        ban: {
            type: DataTypes.TINYINT(2),
            allowNull: true,
            defaultValue: 0,
        },        
    },
    {
        tableName: 'users',
    },
);

module.exports = User;
