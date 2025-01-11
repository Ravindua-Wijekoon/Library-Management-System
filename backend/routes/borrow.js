const express = require('express');
const {
  getBorrowedBooks,
  getAllBorrowedBooks,
  extendDeadline,
} = require('../controllers/borrowController');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/:userId', authenticate, getBorrowedBooks);
router.get('/', authenticate, getAllBorrowedBooks);
router.put('/:id/extend-deadline', authenticate, extendDeadline);

module.exports = router;
