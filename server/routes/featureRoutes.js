import express from 'express';
import {
    getFeatures,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature
} from '../controllers/features.js';

const router = express.Router();

// GET /api/features - Get all features
router.get('/', getFeatures);

// GET /api/features/:id - Get feature by ID
router.get('/:id', getFeatureById);

// POST /api/features - Create new feature
router.post('/', createFeature);

// PUT /api/features/:id - Update feature
router.put('/:id', updateFeature);

// DELETE /api/features/:id - Delete feature
router.delete('/:id', deleteFeature);

export default router;
