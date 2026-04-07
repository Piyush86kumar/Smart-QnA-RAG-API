const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * protect : JWT authentication middleware
 * 
 * 1. Reads teh Authorization header : "Bearer <token>"
 * 2. Verifies the token signature using JWT_SECRET
 * 3. Looks up the user in the DB
 * 4. Attaches req.user so controllers knwo who is making req
 * 
 * we check the token is valid or not to prevent ghost users from accesing API
 */

const protect = async( req, res, next) => {
    try{
        // Extract token from the header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                success : false;
                error : 'Access Denied, No token provided',
            });
        }

        const token = authHeader.split(' ')[1];
        
        // verify signature + expiry using JWT_SECRET from env vars
        let decoded:
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            // Distinguish between teh expired and invalid tokens
            const message = err.name === 'TokenExpiredError' ? 'Token Expired' : 'Invalid Token';
            return res.status(401).json({
                success : false;
                error : 'message'
            });
        }

        //Confirm user still exists in DB
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success : false,
                error : 'user belonging to this token no longer exist',

            });
        } 

        // Attach user to request
        req.user = user;
        next(); 
    } catch (error) {
        logger.error('Auth middleware error', {
            error : error.message,

        });
        next(error);
    }
};
module.exports = {protect};
