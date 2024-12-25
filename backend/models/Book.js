const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    qrCode: String, // Path to the QR code image
    available: { type: Boolean, default: true },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Book', BookSchema);