const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * protect: JWT authentication middleware.
 *
 * HOW IT WORKS:
 * 1. Reads the Authorization header: "Bearer <token>"
 * 2. Verifies the token signature using JWT_SECRET
 * 3. Looks up the user in the DB (confirms they still exist)
 * 4. Attaches req.user so controllers know who's making the request
 *
 * WHY verify the user still exists in DB?
 * The token could be valid but the user may have been deleted.
 * This check prevents ghost users from accessing the API.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify signature + expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Distinguish between expired and invalid tokens for clearer error messages
      const message = err.name === 'TokenExpiredError'
        ? 'Token has expired. Please log in again.'
        : 'Invalid token.';
      return res.status(401).json({ success: false, error: message });
    }

    // 3. Confirm user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User belonging to this token no longer exists.',
      });
    }

    // 4. Attach user to request for downstream use
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    next(error);
  }
};

module.exports = { protect };
