const Book = require('../models/Book');
const User = require('../models/User');
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
        };

        const qrFilePath = path.join(qrDir, `${name}-${savedBook._id}-qr.png`);
        const qrRelativePath = `/qr/${name}-${savedBook._id}-qr.png`;

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
// exports.updateBook = async (req, res) => {
//     const { bookId } = req.params;
//     const { name, author, isbn, description } = req.body;

//     try {
//         const book = await Book.findById(bookId);
//         if (!book) return res.status(404).send('Book not found.');

//         book.name = name || book.name;
//         book.author = author || book.author;
//         book.isbn = isbn || book.isbn;
//         book.description = description || book.description;

//         await book.save();
//         res.status(200).send('Book updated successfully.');
//     } catch (error) {
//         res.status(400).send('Error updating book.');
//     }
// };

// Delete a book
exports.deleteBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send('Book not found.');

        // Delete the QR code image if it exists
        if (book.qrCode) {
            const qrFilePath = path.join(__dirname, '..', book.qrCode);
            if (fs.existsSync(qrFilePath)) {
                fs.unlinkSync(qrFilePath); // Delete the QR code file
            }
        }

        // Delete the book's image if it exists
        if (book.image) {
            const imageFilePath = path.join(__dirname, '..', book.image);
            if (fs.existsSync(imageFilePath)) {
                fs.unlinkSync(imageFilePath); // Delete the image file
            }
        }

        // Delete borrow records related to the book
        await Borrow.deleteMany({ book: bookId });

        // Delete the book document
        await Book.findByIdAndDelete(bookId);

        res.status(200).send('Book and associated files deleted successfully.');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Error deleting book.');
    }
};

// Release a book
exports.releaseBook = async (req, res) => {
    const { bookId, userId } = req.body;

    try {
        // Check if the book exists and is available
        const book = await Book.findById(bookId);
        if (!book || !book.available) {
            return res.status(400).send('Book is not available.');
        }

        // Check if the user exists in the database
        const user = await User.findOne({ index: userId });
        if (!user) {
            console.log('User with this index does not exist.')
            return res.status(404).send('User with this index does not exist.');
        }

        // Check if the user already has an active borrowed book
        const activeBorrow = await Borrow.findOne({
            user: user._id,
            status: 'borrowed',
        });

        if (activeBorrow) {
            return res.status(400).send('User must return the previously borrowed book before borrowing another.');
        }

        // Proceed with releasing the book
        book.available = false;
        book.borrowedBy = user._id;
        await book.save();

        const borrowedDate = new Date();
        const deadlineDate = new Date();
        deadlineDate.setDate(borrowedDate.getDate() + 14);

        const borrow = new Borrow({
            book: bookId,
            user: user._id,
            borrowedDate,
            deadlineDate,
        });
        await borrow.save();

        res.status(200).send('Book released successfully.');
    } catch (error) {
        console.error('Error releasing book:', error);
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

// Get a single book by ID
exports.getBookById = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send('Book not found.');

        res.status(200).json(book);
    } catch (error) {
        res.status(500).send('Error fetching the book.');
    }
};
