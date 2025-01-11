const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    getAllBooks,
    addBook,
    deleteBook,
    releaseBook,
    returnBook,
    getBookById,
} = require('../controllers/bookController');
const { authenticate, isAdmin } = require('../middlewares/authenticate');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Use the book name for the filename, sanitized and with a unique timestamp
        const timestamp = Date.now();
        const sanitizedBookName = req.body.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize book name
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, `${sanitizedBookName}_${timestamp}${ext}`);
    },
});

// File filter for images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// Routes
router.get('/', getAllBooks); // Get all books
router.post('/', authenticate, isAdmin, upload.single('image'), addBook); // Add a new book with image
//router.put('/:bookId', authenticate, isAdmin, updateBook); // Update book details
router.delete('/:bookId', authenticate, isAdmin, deleteBook); // Delete a book
router.post('/release', authenticate, isAdmin, releaseBook); // Release a book to a user
router.post('/return', authenticate, isAdmin, returnBook); // Return a book
router.get('/:bookId', getBookById);

module.exports = router;
