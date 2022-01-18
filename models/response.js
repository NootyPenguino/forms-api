const Joi = require('joi');
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    fields: [{
        type: String
    }],
    text: {
        type: String,
        maxlength: 255
    },
    user: {
        type: String,
        maxlength: 50
    }
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;