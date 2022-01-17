const { User } = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied.')

    jwt.verify(token, config.get('app.jwtPrivateKey'), (err, decoded) => {
        if (err) return res.status(400).send('Access denied.');

        const user = User.findById(decoded._id);
        if (!user) return res.status(401).send('Access denied');

        req.user = decoded;
        next();
    });
}