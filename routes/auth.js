const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        await validateAsync(req.body);
    }
    catch (ex) {
        return res.status(400).send(ex.message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = await user.generateAuthToken();
    res.send(token);
});

function validateAsync(body) {
    const schema = new Joi.object({
        email: Joi.string().max(255).required(),
        password: Joi.string().max(255).required()
    });
    return schema.validateAsync(body);
}

module.exports = router;