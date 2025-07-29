// Add CRUD operations for industries
import Industry from '../models/Industry.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';

const getAllIndustries = async (req, res, next) => {
    try {
        const industries = await Industry.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(industries);
    } catch (error) {
        console.error('Error fetching industries:', error);
        next(error);
    }
};

const getIndustryById = async (req, res, next) => {
    try {
        const industry = await Industry.findByPk(req.params.id);
        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }
        res.json(industry);
    } catch (error) {
        next(error);
    }
};

const createIndustry = async (req, res, next) => {
    try {
        const { name, slug, description, isActive } = req.body;

        // Generate slug if not provided
        const industrySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const industry = await Industry.create({
            name,
            slug: industrySlug,
            description,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json(industry);
    } catch (error) {
        next(error);
    }
};

const updateIndustry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, slug, description, isActive } = req.body;

        const industry = await Industry.findByPk(id);
        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        // Generate slug if name changed and slug not provided
        const industrySlug = slug || (name !== industry.name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : industry.slug);

        // Update fields
        industry.name = name || industry.name;
        industry.slug = industrySlug;
        industry.description = description !== undefined ? description : industry.description;
        industry.isActive = isActive !== undefined ? isActive : industry.isActive;

        await industry.save();
        res.json(industry);
    } catch (error) {
        next(error);
    }
};

const deleteIndustry = async (req, res, next) => {
    try {
        const industry = await Industry.findByPk(req.params.id);
        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        await industry.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export {
    getAllIndustries,
    getIndustryById,
    createIndustry,
    updateIndustry,
    deleteIndustry
};
