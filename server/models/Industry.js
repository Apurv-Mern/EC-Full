// models/Industry.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Industry = sequelize.define('Industry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'industries',
    timestamps: true,
    indexes: [
        { fields: ['name'] },
        { fields: ['slug'] },
        { fields: ['isActive'] }
    ]
});

export default Industry;
