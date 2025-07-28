import express from 'express';
import {
  createEstimation,
  getEstimations,
  getEstimation,
  updateEstimation,
  deleteEstimation,
  getAllDataForEstimation
} from '../controllers/estimationController.js';
import { validateEstimation } from '../middleware/validation.js';

const router = express.Router();

// Static data route
router.get('/data-for-estimation', getAllDataForEstimation);

// CRUD routes
router
  .route('/')
  .get(getEstimations)
  .post(validateEstimation, createEstimation);

router
  .route('/:id')
  .get(getEstimation)
  .put(updateEstimation)
  .delete(deleteEstimation);

export default router;
