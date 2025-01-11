const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role, index } = req.body;
    try {
        const existingUser = await User.findOne({ index });
        if (existingUser) {
            return res.status(400).send('Index number already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword, role, index });
        await user.save();
        res.status(201).send('User registered successfully.');
    } catch (error) {
        res.status(400).send('Error registering user.');
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials.');
        }

        // Include user's name in the token payload
        const token = jwt.sign(
            { id: user._id, name: user.firstName, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Log the token to the console
        console.log(`JWT Token for user ${user.name}:`, token);

        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send('Error logging in.');
    }
};
