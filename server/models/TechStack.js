// models/TechStack.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TechStack = sequelize.define('TechStack', {
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
        type: DataTypes.ENUM('backend', 'frontend', 'mobile', 'database', 'cloud', 'other'),
        allowNull: false
    },
    version: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    difficultyLevel: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'intermediate'
    },
    hourlyRateMultiplier: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 1.0,
        validate: {
            min: 0.1,
            max: 5.0
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'tech_stacks',
    timestamps: true,
    indexes: [
        { fields: ['name'] },
        { fields: ['category'] },
        { fields: ['difficultyLevel'] },
        { fields: ['isActive'] }
    ]
});

export default TechStack;
