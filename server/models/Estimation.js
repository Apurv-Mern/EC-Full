import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Estimation = sequelize.define('Estimation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  industries: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  softwareType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  softwareTypeBasePrice: {
    type: DataTypes.JSON,
    allowNull: false
  },
  techStack: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      backend: '',
      frontend: '',
      mobile: ''
    }
  },
  timeline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timelineMultiplier: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  basePrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  featuresPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  contactCompany: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true,
  tableName: 'estimations'
});

export default Estimation;
