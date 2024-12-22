const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowedDate: { type: Date, default: Date.now },
    returnedDate: { type: Date, default: null },
    status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' }
});

module.exports = mongoose.model('Borrow', BorrowSchema);
