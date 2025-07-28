import { Contact } from '../models/index.js';
import { sendSuccessResponse, sendErrorResponse, sendListResponse } from '../utils/apiResponse.js';

// @desc    Create new contact submission
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res, next) => {
  try {
    const { name, email, company, projectType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return sendErrorResponse(res, 'Please provide name, email, and message', 400);
    }

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      company,
      projectType,
      message
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return sendSuccessResponse(res, contact, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private (should be protected in production)
const getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const contacts = await Contact.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return sendListResponse(res, contacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private (should be protected in production)
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return sendErrorResponse(res, 'Contact not found', 404);
    }

    return sendSuccessResponse(res, contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private (should be protected in production)
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return sendErrorResponse(res, 'Contact not found', 404);
    }

    const { status } = req.body;
    const updateData = { status };

    // If status is responded, set respondedAt
    if (status === 'responded' && !contact.respondedAt) {
      updateData.respondedAt = new Date();
    }

    await contact.update(updateData);

    return sendSuccessResponse(res, contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private (should be protected in production)
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return sendErrorResponse(res, 'Contact not found', 404);
    }

    await contact.destroy();

    return sendSuccessResponse(res, {});
  } catch (error) {
    next(error);
  }
};

// Alternative: Default export as an object
export {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
};
