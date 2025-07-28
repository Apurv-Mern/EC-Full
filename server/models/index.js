import sequelize from '../config/database.js';
import Industry from './Industry.js';
import SoftwareType from './SoftwareType.js';
import TechStack from './TechStack.js';
import Timeline from './Timeline.js';
import Feature from './Feature.js';
import Currency from './Currency.js';
import Contact from './Contact.js';
import Estimation from './Estimation.js';


// Define associations
const setupAssociations = () => {
    // Estimation associations - Fix the naming collision
    Estimation.belongsTo(Industry, {
        foreignKey: 'industryId',
        as: 'industryDetails' // Changed from 'industry'
    });

    Estimation.belongsTo(SoftwareType, {
        foreignKey: 'softwareTypeId',
        as: 'softwareTypeDetails' // Changed from 'softwareType'
    });

    Estimation.belongsTo(Timeline, {
        foreignKey: 'timelineId',
        as: 'timelineDetails' // Changed from 'timeline'
    });

    Estimation.belongsTo(Currency, {
        foreignKey: 'currencyId',
        as: 'currencyDetails' // Changed from 'currency'
    });

    // Many-to-many relationships
    Estimation.belongsToMany(Feature, {
        through: 'EstimationFeatures',
        foreignKey: 'estimationId',
        otherKey: 'featureId',
        as: 'selectedFeatures' // More descriptive name
    });

    Estimation.belongsToMany(TechStack, {
        through: 'EstimationTechStacks',
        foreignKey: 'estimationId',
        otherKey: 'techStackId',
        as: 'selectedTechStacks' // More descriptive name
    });

    // Reverse associations
    Feature.belongsToMany(Estimation, {
        through: 'EstimationFeatures',
        foreignKey: 'featureId',
        otherKey: 'estimationId',
        as: 'estimations'
    });

    TechStack.belongsToMany(Estimation, {
        through: 'EstimationTechStacks',
        foreignKey: 'techStackId',
        otherKey: 'estimationId',
        as: 'estimations'
    });
};

// Setup associations
setupAssociations();

export {
    sequelize,
    Industry,
    SoftwareType,
    TechStack,
    Timeline,
    Feature,
    Currency,
    Contact,
    Estimation
};
