import { sendErrorResponse } from '../utils/apiResponse.js';

// Validate estimation creation request
export const validateEstimation = (req, res, next) => {
  const {
    industries,
    softwareType,
    techStack,
    timeline,
    timelineMultiplier,
    features,
    currency
  } = req.body;

  // Check required fields
  if (!industries || !Array.isArray(industries) || industries.length === 0) {
    return sendErrorResponse(res, 'Please select at least one industry', 400);
  }

  if (!softwareType) {
    return sendErrorResponse(res, 'Please select a software type', 400);
  }

  if (!timeline || typeof timelineMultiplier !== 'number') {
    return sendErrorResponse(res, 'Please select a valid timeline', 400);
  }

  if (!currency) {
    return sendErrorResponse(res, 'Please select a currency', 400);
  }

  next();
};

// Validate contact creation request
export const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;

  // Check required fields
  if (!name || name.trim().length === 0) {
    return sendErrorResponse(res, 'Name is required', 400);
  }

  if (!email || !isValidEmail(email)) {
    return sendErrorResponse(res, 'Valid email is required', 400);
  }

  if (!message || message.trim().length === 0) {
    return sendErrorResponse(res, 'Message is required', 400);
  }

  next();
};

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
