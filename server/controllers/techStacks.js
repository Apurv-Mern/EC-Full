// Add Crud operations for tech stacks
import TechStack from '../models/TechStack.js';

const getTechStacks = async (req, res, next) => {
    try {
        const techStacks = await TechStack.findAll();
        res.json(techStacks);
    } catch (error) {
        next(error);
    }
};

const getTechStackById = async (req, res, next) => {
    try {
        const techStack = await TechStack.findByPk(req.params.id);
        if (!techStack) {
            return res.status(404).json({ message: 'Tech Stack not found' });
        }

        res.json(techStack);
    } catch (error) {
        next(error);
    }
};

const createTechStack = async (req, res, next) => {
    try {
        const { name, category, version, description, difficultyLevel, hourlyRateMultiplier, isActive } = req.body;
        const techStack = await TechStack.create({
            name,
            category,
            version,
            description,
            difficultyLevel,
            hourlyRateMultiplier,
            isActive
        });
        res.status(201).json(techStack);
    } catch (error) {
        next(error);
    }
};


const updateTechStack = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, category, version, description, difficultyLevel, hourlyRateMultiplier, isActive } = req.body;
        const techStack = await TechStack.findByPk(id);
        if (!techStack) {
            return res.status(404).json({ message: 'Tech Stack not found' });
        }

        // Update fields
        techStack.name = name;
        techStack.category = category;
        techStack.version = version;
        techStack.description = description;
        techStack.difficultyLevel = difficultyLevel;
        techStack.hourlyRateMultiplier = hourlyRateMultiplier;
        techStack.isActive = isActive;

        await techStack.save();
        res.json(techStack);
    } catch (error) {
        next(error);
    }
};

const deleteTechStack = async (req, res, next) => {
    try {
        const { id } = req.params;
        const techStack = await TechStack.findByPk(id);
        if (!techStack) {
            return res.status(404).json({ message: 'Tech Stack not found' });
        }
        await techStack.destroy();
        res.status(204).send();

    } catch (error) {
        next(error);
    }
};


export {
    getTechStacks,
    getTechStackById,
    createTechStack,
    updateTechStack,
    deleteTechStack,
};