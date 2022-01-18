const mongoose = require('mongoose');

module.exports = mongoose.model('Field', new mongoose.Schema({
    text: {
        type: String,
        required: true,
        min: 1,
        max: 25
    }
}));