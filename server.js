require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

/**
 * server.js — the entry point.
 *
 * Responsibilities:
 * 1. Load environment variables
 * 2. Connect to MongoDB
 * 3. Start listening on PORT
 * 4. Handle unhandled rejections / exceptions gracefully
 */

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to DB before accepting requests
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    /**
     * Graceful shutdown:
     * On unhandled promise rejection, close the server cleanly
     * before exiting. This allows in-flight requests to complete.
     */
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION — shutting down', { error: err.message });
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM (sent by Docker / process managers on shutdown)
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received — shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();
