const Joi = require('joi');
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    fieldType: {
        type: String,
        required: true,
        enum: ['text', 'drop', 'radio', 'check']
    },
    fields: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field'
    }],
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response'
    }]
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;