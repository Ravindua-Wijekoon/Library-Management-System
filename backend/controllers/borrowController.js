const Borrow = require('../models/Borrow');

// Get borrowed books for a user
exports.getBorrowedBooks = async (req, res) => {
    const { userId } = req.params;

    try {
        const borrowRecords = await Borrow.find({ user: userId })
            .populate('book')
            .populate('user');

        res.status(200).json(borrowRecords);
    } catch (error) {
        res.status(500).send('Error fetching borrowed books.');
    }
};

exports.getAllBorrowedBooks = async (req, res) => {
    try {
        const borrowRecords = await Borrow.find({ status: 'borrowed' })
            .populate('book', 'name')
            .populate('user', 'index');
        
        console.log('Raw Borrow Records:', borrowRecords); // Debug log

        const formattedRecords = borrowRecords.map(record => ({
            id: record._id,
            bookName: record.book.name,
            userIndex: record.user.index,
            borrowedDate: record.borrowedDate,
        }));

        res.status(200).json(formattedRecords);
    } catch (error) {
        console.error('Error fetching borrowed books:', error); // Debug error
        res.status(500).send('Error fetching borrowed books.');
    }
};
