const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrashPoint = sequelize.define(
    'TrashPoint',
    {
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        date: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT(2),
            allowNull: false,
        },
        categ: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        lat: {
            type: DataTypes.CHAR(32),
            allowNull: false,
        },
        lng: {
            type: DataTypes.CHAR(32),
            allowNull: false,
        },
        icon: {
            type: DataTypes.CHAR(32),
            allowNull: false,
        },    
        name: {
            type: DataTypes.CHAR(255),
            allowNull: false,  
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,  
        },
        image_user: {
            type: DataTypes.TEXT,
            allowNull: false,  
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,  
        },
        info: {
            type: DataTypes.TEXT,
            allowNull: false,  
        },
        size: {
            type: DataTypes.CHAR(255),
            allowNull: false,  
        },
    },
    {
        tableName: 'trash_points',
    },
);

module.exports = TrashPoint;
