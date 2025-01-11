const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Authorization header is missing');
        return res.status(401).json({ error: 'Authorization header is missing.' });
    }
    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        console.log('Invalid token format', authHeader);
        return res.status(401).json({ error: 'Invalid token format. Expected "Bearer <token>".' });
    }
    const token = tokenParts[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token.', details: err.message });
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
