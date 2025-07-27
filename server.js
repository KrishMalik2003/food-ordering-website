const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodorder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    mobile: String
});

const orderSchema = new mongoose.Schema({
    userEmail: String,
    cart: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    date: { type: Date, default: Date.now }
});

// Define models
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { email, password, mobile } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const user = new User({ email, password, mobile });
        await user.save();
        res.json({ success: true });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Order endpoint
app.post('/order', async (req, res) => {
    try {
        const { userEmail, cart, total } = req.body;

        if (!userEmail || !cart || !Array.isArray(cart) || cart.length === 0 || total == null) {
            return res.status(400).json({ success: false, message: 'Invalid order data' });
        }

        const newOrder = new Order({ userEmail, cart, total });
        await newOrder.save();

        console.log('Order saved:', newOrder);
        res.json({ success: true, message: 'Order saved' });
    } catch (err) {
        console.error('Order save error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
