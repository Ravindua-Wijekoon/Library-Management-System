const Book = require('../models/Book');
const qr = require('qrcode');

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).send('Error fetching books.');
    }
};

// Add a new book
exports.addBook = async (req, res) => {
    const { name, author, isbn, description } = req.body;
    const image = req.file.path;

    try {
        const qrCodeData = JSON.stringify({ name, author, isbn });
        const qrCode = await qr.toDataURL(qrCodeData);

        const book = new Book({ name, author, isbn, description, image, qrCode });
        await book.save();
        res.status(201).send('Book added successfully.');
    } catch (error) {
        res.status(400).send('Error adding book.');
    }
};

// Release a book to a user
exports.releaseBook = async (req, res) => {
    const { bookId, userId } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book || !book.available) {
            return res.status(400).send('Book is not available.');
        }

        book.available = false;
        book.borrowedBy = userId;
        await book.save();
        res.status(200).send('Book released successfully.');
    } catch (error) {
        res.status(500).send('Error releasing book.');
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    const { bookId } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book || book.available) {
            return res.status(400).send('Invalid operation.');
        }

        book.available = true;
        book.borrowedBy = null;
        await book.save();
        res.status(200).send('Book returned successfully.');
    } catch (error) {
        res.status(500).send('Error returning book.');
    }
};
