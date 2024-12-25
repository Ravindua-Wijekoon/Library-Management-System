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
