import express from 'express';
import {
  getAllIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry
} from '../controllers/industries.js';

const router = express.Router();

// GET /api/industries - Get all industries
router.get('/', getAllIndustries);

// GET /api/industries/:id - Get industry by ID
router.get('/:id', getIndustryById);

// POST /api/industries - Create new industry
router.post('/', createIndustry);

// PUT /api/industries/:id - Update industry
router.put('/:id', updateIndustry);

// DELETE /api/industries/:id - Delete industry
router.delete('/:id', deleteIndustry);

export default router;
