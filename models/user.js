const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('Joi');
const passwordCompletexity = require('joi-password-complexity');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024
    },
    permissions: {
        type: [String],
        enum: ['admin']
    }
});

userSchema.methods.generateAuthToken = function() {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            _id: this._id,
            permissions: this.permissions
        }, config.get('app.jwtPrivateKey'));
        resolve(token);
    });
}

const User = mongoose.model('User', userSchema);

function validateUserAsync(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(25).required(),
        lastName: Joi.string().min(3).max(25).required(),
        email: Joi.string().min(5).max(255).required().email().lowercase(),
        password: passwordCompletexity({
            min: 8,
            max: 26,
            lowerCase: 2,
            upperCase: 2,
            numeric: 2,
            symbol: 2,
            requirementCount: 8
        }, 'Password').required(),
        permissions: Joi.array().items(Joi.string().valid('admin')).unique()
    });
    return schema.validateAsync(user);
};

module.exports = {
    User,
    validateAsync: validateUserAsync
}