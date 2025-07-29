import express from 'express';
import {
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency
} from '../controllers/currencies.js';

const router = express.Router();

// GET /api/currencies - Get all currencies
router.get('/', getAllCurrencies);

// GET /api/currencies/:id - Get currency by ID
router.get('/:id', getCurrencyById);

// POST /api/currencies - Create new currency
router.post('/', createCurrency);

// PUT /api/currencies/:id - Update currency
router.put('/:id', updateCurrency);

// DELETE /api/currencies/:id - Delete currency
router.delete('/:id', deleteCurrency);

export default router;
