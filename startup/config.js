const Joi = require('joi');
const config = require('config');

module.exports = function() {
    if(!config.get('app.jwtPrivateKey')){
        throw new Error('jwtPrivateKey undefined')
    }
    Joi.objectId = require('joi-objectid')(Joi);
}