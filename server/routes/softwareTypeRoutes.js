import express from 'express';
import {
    getSoftwareTypes,
    getSoftwareTypeById,
    createSoftwareType,
    updateSoftwareType,
    deleteSoftwareType
} from '../controllers/SoftwareTypes.js';

const router = express.Router();

// GET /api/software-types - Get all software types
router.get('/', getSoftwareTypes);

// GET /api/software-types/:id - Get software type by ID
router.get('/:id', getSoftwareTypeById);

// POST /api/software-types - Create new software type
router.post('/', createSoftwareType);

// PUT /api/software-types/:id - Update software type
router.put('/:id', updateSoftwareType);

// DELETE /api/software-types/:id - Delete software type
router.delete('/:id', deleteSoftwareType);

export default router;
