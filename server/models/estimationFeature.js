// models/EstimationFeature.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EstimationFeature = sequelize.define('EstimationFeature', {
    estimationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'estimations',
            key: 'id'
        }
    },
    featureId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'features',
            key: 'id'
        }
    },
    customHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Override default feature hours'
    },
    customPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Override default feature price'
    }
}, {
    tableName: 'estimation_features',
    timestamps: true
});

export default EstimationFeature;
