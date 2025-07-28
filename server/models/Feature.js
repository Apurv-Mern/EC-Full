// models/Feature.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Feature = sequelize.define('Feature', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    estimatedHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 1000
        }
    },
    complexity: {
        type: DataTypes.ENUM('simple', 'medium', 'complex'),
        defaultValue: 'medium'
    },
    basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    prerequisites: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of feature IDs that must be included'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'features',
    timestamps: true,
    indexes: [
        { fields: ['name'] },
        { fields: ['category'] },
        { fields: ['complexity'] },
        { fields: ['estimatedHours'] },
        { fields: ['isActive'] }
    ]
});

export default Feature;
