// Import auth service functions — business logic lives here, not in controller
const { registerUser, loginUser } = require('../services/authService');

/**
 * Auth Controller — handles HTTP layer for authentication.
 * 
 * Controllers stay THIN:
 * - Validate input format
 * - Call service
 * - Return response
 * Business logic belongs in services/ (clean architecture ✅)
 */

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * Returns: JWT token + user info on success
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields — fail fast, clear error message
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // Delegate to service: handles hashing, uniqueness checks, JWT generation
    const result = await registerUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
       result,
    });
  } catch (error) {
    // Pass error to global Express error handler (no stack leaks to client)
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: JWT token for authenticated requests (Task 3 requirement)
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Delegate to service: verifies credentials + issues JWT
    const result = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
       result,
    });
  } catch (error) {
    next(error); // Centralized error handling
  }
};

module.exports = { register, login };