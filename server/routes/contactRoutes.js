import express from 'express';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { validateContact } from '../middleware/validation.js';

const router = express.Router();

router
  .route('/')
  .get(getContacts)
  .post(validateContact, createContact);

router
  .route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

export default router;
