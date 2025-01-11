const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowedDate: { type: Date, default: Date.now },
    returnedDate: { type: Date, default: null },
    deadlineDate: { type: Date, required: true },
    status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' },
    extended: { type: Boolean, default: false },
});

module.exports = mongoose.model('Borrow', BorrowSchema);
