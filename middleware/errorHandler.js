const logger = require('../utils/logger');

/**
 * errorHandler: Express global error handling middleware.
 *
 * WHY centralize errors?
 * - Consistent error response format across the entire API
 * - No raw stack traces exposed to clients in production
 * - Single place to add error monitoring (Sentry, etc.) later
 *
 * HOW it works:
 * Any controller/middleware that calls next(error) lands here.
 * We map known error types to appropriate HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  // Log error internally for debugging — never send full stack to client
  logger.error('Unhandled error', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    userId: req.user?._id,
  });

  // Default to 500 unless error specifies otherwise
  let statusCode = err.statusCode || 500;

  // Mongoose validation error — e.g., missing required field
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join('. '),
    });
  }

  // MongoDB duplicate key — e.g., email already registered
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists`,
    });
  }

  // Invalid MongoDB ObjectId format — e.g., bad :id param
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid ID format: ${err.value}`,
    });
  }

  // Generic error response — hide details in production (Task 4 requirement ✅)
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Something went wrong',
  });
};

/**
 * notFound: 404 handler for unmatched routes.
 * Placed before errorHandler in the middleware stack.
 */
const notFound = (req, res, next) => {
  // Create a 404 error and pass to errorHandler for consistent logging/response
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };