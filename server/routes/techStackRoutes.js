import express from 'express';
import {
    getTechStacks,
    getTechStackById,
    createTechStack,
    updateTechStack,
    deleteTechStack
} from '../controllers/techStacks.js';

const router = express.Router();

// GET /api/tech-stacks - Get all tech stacks
router.get('/', getTechStacks);

// GET /api/tech-stacks/:id - Get tech stack by ID
router.get('/:id', getTechStackById);

// POST /api/tech-stacks - Create new tech stack
router.post('/', createTechStack);

// PUT /api/tech-stacks/:id - Update tech stack
router.put('/:id', updateTechStack);

// DELETE /api/tech-stacks/:id - Delete tech stack
router.delete('/:id', deleteTechStack);

export default router;
