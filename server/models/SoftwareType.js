// models/SoftwareType.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SoftwareType = sequelize.define('SoftwareType', {
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
    category: {
        type: DataTypes.ENUM('web', 'mobile', 'desktop', 'api', 'other'),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('OS', 'software'),
        allowNull: false,
        defaultValue: 'software'
    },
    basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    complexity: {
        type: DataTypes.ENUM('simple', 'medium', 'complex'),
        defaultValue: 'medium'
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
    tableName: 'software_types',
    timestamps: true,
    indexes: [
        { fields: ['name'] },
        { fields: ['category'] },
        { fields: ['type'] },
        { fields: ['complexity'] },
        { fields: ['isActive'] }
    ]
});

export default SoftwareType;
