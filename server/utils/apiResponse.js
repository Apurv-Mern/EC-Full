// Success response helper
export const sendSuccessResponse = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

// Error response helper
export const sendErrorResponse = (res, message = 'Server Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

// Response with count (for list endpoints)
export const sendListResponse = (res, data = [], statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    count: data.length,
    data
  });
};
