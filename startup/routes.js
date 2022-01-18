const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const auth = require('../routes/auth');
const forms = require('../routes/forms');
const users = require('../routes/users');
const error = require('../middleware/error');
const express = require('express');

module.exports = function(app) {
    app.use(helmet());
    if (config.get('app.env') !== 'production')
        app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use('/api/auth', auth);
    app.use('/api/forms', forms);
    app.use('/api/users', users);
    app.use(error);
}