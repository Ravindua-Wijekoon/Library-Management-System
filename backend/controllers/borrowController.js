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
            deadlineDate: record.deadlineDate,
        }));

        res.status(200).json(formattedRecords);
    } catch (error) {
        console.error('Error fetching borrowed books:', error); // Debug error
        res.status(500).send('Error fetching borrowed books.');
    }
};

// Extend deadline by 7 days
exports.extendDeadline = async (req, res) => {
    const { id } = req.params;
    const { deadlineDate } = req.body;
  
    if (!deadlineDate) {
      return res.status(400).send('Deadline date is required.');
    }
  
    try {
      const borrow = await Borrow.findById(id);
      if (!borrow) {
        return res.status(404).send('Borrow record not found.');
      }
  
      if (borrow.extended) {
        return res.status(400).send('Deadline has already been extended.');
      }
  
      borrow.deadlineDate = new Date(deadlineDate);
      borrow.extended = true; 
      await borrow.save();
  
      res.status(200).json({
        message: 'Deadline extended successfully.',
        borrow, 
      });
    } catch (error) {
      console.error('Failed to extend deadline:', error);
      res.status(500).send('Failed to extend deadline.');
    }
  };
