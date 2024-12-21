const express = require('express');
const multer = require('multer');
const {
    getAllBooks,
    addBook,
    releaseBook,
    returnBook,
} = require('../controllers/bookController');
const authenticate = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.get('/', authenticate, getAllBooks);
router.post('/', authenticate, isAdmin, upload.single('image'), addBook);
router.post('/release', authenticate, isAdmin, releaseBook);
router.post('/return', authenticate, isAdmin, returnBook);

module.exports = router;
