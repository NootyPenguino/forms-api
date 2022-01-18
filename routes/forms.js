const auth = require('../middleware/auth');
const Field = require('../models/field');
const Question = require('../models/question');
const { Form, validateFormAsync, validateFormIdAsync } = require('../models/form');
const express = require('express');
const router = express.Router();

router.get('/:id/result', auth, async (req, res) => {
    
});

router.get('/:id', async (req, res) => {
    try {
        await validateFormIdAsync(req.params.id)
    }
    catch (ex) {
        return res.status(400).send(ex.message);
    }

    const form = await Form
        .findById(req.params.id)
        .populate({
            path: 'questions',
            select: '-__v -responses',
            populate: { path: 'fields', select: '-__v' }
        })
        .populate('author', 'id firstName lastName')
        .select('-__v');
    
    if (!form) return res.status(404).send('Form does not exist.');
    
    res.send(form);
});

router.post('/:id', async (req, res) => {

});

router.post('/', auth, async (req, res) => {
    try {
        await validateFormAsync(req.body);
    }
    catch (ex) {
        return res.status(400).send(ex.message);
    }

    const form = new Form({
        title: req.body.title,
        author: req.user._id
    });

    for (let question of req.body.questions) {
        const newQuestion = new Question({
            title: question.title,
            fieldType: question.fieldType
        });
        if (newQuestion.fieldType !== 'text') {
            for (let field of question.fields) {
                const newField = new Field({
                    text: field
                })
                await newField.save();
                newQuestion.fields.push(newField._id);
            }
        }
        else newQuestion.fields = []
        await newQuestion.save();
        form.questions.push(newQuestion._id);
    }

    await form.save();

    res.send(form);
});

module.exports = router;