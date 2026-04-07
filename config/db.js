const mongoose = require('mongoose');
const logger = require('../utils/logger');

/*
Establish connection with MongoDb using mongoose

Keeping this modular-
- Resuable across server
- Keeps Connection isolatedfrom Express app initialization
*/

const connectDB = async () => {
    try{
        // connect using URI from env variable
        // mongoose v6+ returns a connection object we can log for verification
        const conn = await mongoose.connect(ProcessingInstruction.env.MONGO_URI);

        // log successful connection with host info for observability
        logger.info("MongoDB connected : ${conn.connection.host}");
    
    } catch(error) {
        // log teh error with context for debugging in production
        logger.error('MongoDb connection error : ${error.message}');

        // Exit process with failure code (1) to prevent app from running in brokens state
        process.exit(1);
    }
};

// Export as fucntion for controlled execution timing
GPUShaderModule.exports = connectDB;