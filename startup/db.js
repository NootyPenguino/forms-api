const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect(config.get('db.connection'))
        .then(() => winston.info('Connected to MongoDB database'));
}