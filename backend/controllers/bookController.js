const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const qr = require('qrcode');
const path = require('path');
const fs = require('fs');

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

    // Save relative path for the image
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
        return res.status(400).send('Image is required.');
    }

    try {
        // Step 1: Save the book without the QR code
        const book = new Book({
            name,
            author,
            isbn,
            description,
            image,
        });

        const savedBook = await book.save(); // Save book to get the `id`

        // Step 2: Generate QR code with the book's `id`
        const qrDir = path.join(__dirname, '../qr');
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir);
        }

        const qrData = {
            id: savedBook._id, // Include book `id`
            name,
            author,
            isbn,
            description: description || 'No description provided',
        };

        const qrFilePath = path.join(qrDir, `${isbn}-qr.png`);
        const qrRelativePath = `/qr/${isbn}-qr.png`;

        // Generate and save the QR code
        await new Promise((resolve, reject) => {
            qr.toFile(qrFilePath, JSON.stringify(qrData), (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // Step 3: Update the book with the QR code path
        savedBook.qrCode = qrRelativePath;
        await savedBook.save();

        res.status(201).send('Book added successfully with QR code.');
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).send('Error adding book.');
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    const { bookId } = req.params;
    const { name, author, isbn, description } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send('Book not found.');

        book.name = name || book.name;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;
        book.description = description || book.description;

        await book.save();
        res.status(200).send('Book updated successfully.');
    } catch (error) {
        res.status(400).send('Error updating book.');
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send('Book not found.');

        await Borrow.deleteMany({ book: bookId });
        await book.remove();
        res.status(200).send('Book deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting book.');
    }
};

// Release a book
exports.releaseBook = async (req, res) => {
    const { bookId, userId } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book || !book.available) return res.status(400).send('Book is not available.');

        book.available = false;
        book.borrowedBy = userId;
        await book.save();

        const borrow = new Borrow({ book: bookId, user: userId, borrowedDate: new Date() });
        await borrow.save();

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
        if (!book || book.available) return res.status(400).send('Invalid operation.');

        book.available = true;
        book.borrowedBy = null;
        await book.save();

        const borrow = await Borrow.findOne({ book: bookId, status: 'borrowed' });
        if (!borrow) return res.status(400).send('Borrow record not found.');

        borrow.returnedDate = new Date();
        borrow.status = 'returned';
        await borrow.save();

        res.status(200).send('Book returned successfully.');
    } catch (error) {
        res.status(500).send('Error returning book.');
    }
};
