// models/Currency.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Currency = sequelize.define('Currency', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true,
        validate: {
            isUppercase: true,
            len: [3, 3]
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    symbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 10]
        }
    },
    flag: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    exchangeRate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: 1.0000,
        comment: 'Exchange rate relative to base currency (USD)'
    },
    isBaseCurrency: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'currencies',
    timestamps: true,
    indexes: [
        { fields: ['code'] },
        { fields: ['isBaseCurrency'] },
        { fields: ['isActive'] }
    ]
});

export default Currency;
