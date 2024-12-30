const express = require('express');
const { getBorrowedBooks, getAllBorrowedBooks } = require('../controllers/borrowController');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/:userId', authenticate, getBorrowedBooks); 
router.get('/', authenticate, getAllBorrowedBooks); 

module.exports = router;
