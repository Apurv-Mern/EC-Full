// Add crud operations for timeline
import Timeline from '../models/Timeline.js';
const getAllTimelines = async (req, res, next) => {
    try {
        const timelines = await Timeline.findAll();
        res.status(200).json(timelines);
    } catch (error) {
        console.error('Error fetching timelines:', error);
        next(error);
    }
};
const createTimeline = async (req, res, next) => {
    try {
        const { label, durationInMonths, multiplier, description, isActive } = req.body;
        const newTimeline = await Timeline.create({
            label,
            durationInMonths,
            multiplier,
            description,
            isActive
        });
        res.status(201).json(newTimeline);
    } catch (error) {
        next(error);
    }
};
const updateTimeline = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { label, durationInMonths, multiplier, description, isActive } = req.body;
        const updatedTimeline = await Timeline.findByPk(id);
        if (!updatedTimeline) {
            return res.status(404).json({ error: 'Timeline not found' });
        }

        // Update fields
        updatedTimeline.label = label;
        updatedTimeline.durationInMonths = durationInMonths;
        updatedTimeline.multiplier = multiplier;
        updatedTimeline.description = description;
        updatedTimeline.isActive = isActive;

        await updatedTimeline.save();
        res.status(200).json(updatedTimeline);
    } catch (error) {
        next(error);
    }
};

const deleteTimeline = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedTimeline = await Timeline.findByPk(id);
        if (!deletedTimeline) {
            return res.status(404).json({ error: 'Timeline not found' });
        }
        await deletedTimeline.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export {
    getAllTimelines,
    createTimeline,
    updateTimeline,
    deleteTimeline
};
