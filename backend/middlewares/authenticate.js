const jwt = require('jsonwebtoken');

// Middleware for verifying JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).send('Token is required.');

    const token = authHeader.split(' ')[1]; // Extract the token
    if (!token) return res.status(403).send('Token is missing.');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return res.status(403).send('Invalid or expired token.');
        }
        req.user = decoded;
        next();
    });
};

// Middleware for checking admin role
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).send('Access denied.');
    }
    next();
};

module.exports = { authenticate, isAdmin };
