const express = require('express');
const { getBorrowedBooks } = require('../controllers/borrowController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/:userId', authenticate, getBorrowedBooks);

module.exports = router;
