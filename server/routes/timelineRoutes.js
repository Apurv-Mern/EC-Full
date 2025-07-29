import express from 'express';
import {
    getAllTimelines,
    createTimeline,
    updateTimeline,
    deleteTimeline
} from '../controllers/Timeline.js';

const router = express.Router();

// GET /api/timelines - Get all timelines
router.get('/', getAllTimelines);

// POST /api/timelines - Create new timeline
router.post('/', createTimeline);

// PUT /api/timelines/:id - Update timeline
router.put('/:id', updateTimeline);

// DELETE /api/timelines/:id - Delete timeline
router.delete('/:id', deleteTimeline);

export default router;
