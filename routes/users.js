const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { User, validateAsync } = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    res.send(user);
});

router.post('/', async (req, res) => {
    try{
        await validateAsync(req.body);
    }
    catch(ex) {
        return res.status(400).send(ex.message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('A user with that email already exists.');

    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = await user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));
});

module.exports = router;