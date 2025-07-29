// Add CRUD operations for software types

import SoftwareType from '../models/SoftwareType.js';
const getSoftwareTypes = async (req, res, next) => {
    try {
        const softwareTypes = await SoftwareType.findAll();
        res.json(softwareTypes);
    } catch (error) {
        next(error);
    }
};

const getSoftwareTypeById = async (req, res, next) => {
    try {
        const softwareType = await SoftwareType.findByPk(req.params.id);
        if (!softwareType) {
            return res.status(404).json({ message: 'Software Type not found' });
        }
        res.json(softwareType);
    } catch (error) {
        next(error);
    }
};

const createSoftwareType = async (req, res, next) => {
    try {
        const { name, category, basePrice, complexity, description, isActive } = req.body;
        const softwareType = await SoftwareType.create({
            name,
            category,
            basePrice,
            complexity,
            description,
            isActive
        });
        res.status(201).json(softwareType);
    } catch (error) {
        next(error);
    }
};

const updateSoftwareType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, category, basePrice, complexity, description, isActive } = req.body;
        const softwareType = await SoftwareType.findByPk(id);
        if (!softwareType) {
            return res.status(404).json({ message: 'Software Type not found' });
        }

        // Update fields
        softwareType.name = name;
        softwareType.category = category;
        softwareType.basePrice = basePrice;
        softwareType.complexity = complexity;
        softwareType.description = description;
        softwareType.isActive = isActive;

        await softwareType.save();
        res.json(softwareType);
    } catch (error) {
        next(error);
    }
};

const deleteSoftwareType = async (req, res, next) => {
    try {
        const softwareType = await SoftwareType.findByPk(req.params.id);
        if (!softwareType) {
            return res.status(404).json({ message: 'Software Type not found' });
        }
        await softwareType.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}



export {
    getSoftwareTypes,
    getSoftwareTypeById,
    createSoftwareType,
    updateSoftwareType,
    deleteSoftwareType
};