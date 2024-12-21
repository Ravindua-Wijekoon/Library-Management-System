const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    isbn: String,
    description: String,
    image: String,
    qrCode: String,
    available: { type: Boolean, default: true },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Book', BookSchema);
