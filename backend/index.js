// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const secretKey = 'anything_13432';

const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/speroweb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User schema
const userSchema = new mongoose.Schema({
    name: { type: 'string' },
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
    Phone: { type: 'string' },
    Mobile: { type: 'string' },
    zipCode: { type: 'string' },
    profilePic: { type: 'string' },
    lat: { type: 'string' },
    lang: { type: 'string' },

});
const User = mongoose.model('user', userSchema);

// Middleware
app.use(bodyParser.json());
const verify = (token) => {
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return false;
        }
        return true
    });
}

app.put('/user/:id', async (req, res) => {
    // code yet to add
});


// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone, zipcode, image } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            Phone: phone,
            zipCode: zipcode,
            // profilePic: image
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create and send JWT token
        const token = jwt.sign({ email: user.email }, secretKey);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
