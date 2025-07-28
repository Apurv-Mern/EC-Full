// models/Timeline.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Timeline = sequelize.define('Timeline', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    label: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 50]
        }
    },
    durationInMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 60
        }
    },
    multiplier: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 1.0,
        validate: {
            min: 0.1,
            max: 3.0
        }
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
    tableName: 'timelines',
    timestamps: true,
    indexes: [
        { fields: ['label'] },
        { fields: ['durationInMonths'] },
        { fields: ['multiplier'] },
        { fields: ['isActive'] }
    ]
});

export default Timeline;
