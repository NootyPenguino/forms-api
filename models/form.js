const Joi = require('joi');
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

const Form = mongoose.model('Form', formSchema);

function validateFormAsync(form) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        questions: Joi.array().items({
            title: Joi.string().min(3).max(255).required(),
            fieldType: Joi.string().valid('text', 'drop', 'radio', 'check').required(),
            fields: Joi.when('fieldType',
            {
                not: 'text',
                then: Joi.array().items(Joi.string().min(1).max(25).required()).required().min(1),
                otherwise: Joi.any()
            })
        }).required().min(1)
    });
    return schema.validateAsync(form);
}

function validateFormIdAsync(id) {
    const schema = Joi.objectId().required();
    return schema.validateAsync(id);
}

module.exports = {
    Form,
    validateFormAsync,
    validateFormIdAsync
};