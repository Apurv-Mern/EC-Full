// Add CRUD operations for features
import Feature from '../models/Feature.js';

const getFeatures = async (req, res, next) => {
    try {
        const features = await Feature.findAll();
        res.json(features);
    } catch (error) {
        console.error('Error creating estimation:', error);
        next(error);
    };
}
const getFeatureById = async (req, res, next) => {
    try {
        const feature = await Feature.findByPk(req.params.id);
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }

        res.json(feature);
    } catch (error) {
        console.error('Error creating estimation:', error);
        next(error);
    }
};

const createFeature = async (req, res, next) => {
    try {
        const { name, category, estimatedHours, complexity, basePrice, description, prerequisites, isActive } = req.body;
        const feature = await Feature.create({
            name,
            category,
            estimatedHours,
            complexity,
            basePrice,
            description,
            prerequisites,
            isActive
        });
        res.status(201).json(feature);
    } catch (error) {
        console.error('Error creating estimation:', error);
        next(error);
    }
};

const updateFeature = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, category, estimatedHours, complexity, basePrice, description, prerequisites, isActive } = req.body;
        const feature = await Feature.findByPk(id);
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }

        // Update fields
        feature.name = name;
        feature.category = category;
        feature.estimatedHours = estimatedHours;
        feature.complexity = complexity;
        feature.basePrice = basePrice;
        feature.description = description;
        feature.prerequisites = prerequisites;
        feature.isActive = isActive;

        await feature.save();
        res.json(feature);
    } catch (error) {
        console.error('Error creating estimation:', error);
        next(error);
    }
};

const deleteFeature = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feature = await Feature.findByPk(id);
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        await feature.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error creating estimation:', error);
        next(error);
    }
}

export { getFeatures, getFeatureById, createFeature, updateFeature, deleteFeature };