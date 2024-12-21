const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required.');

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = decoded;
        next();
    });
};

module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied.');
    }
    next();
};
