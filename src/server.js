require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Security / Middleware
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());

// Import Routes
const settingsRoutes = require('../routes/settingsRoutes');
const productRoutes = require('../routes/productRoutes');
const userRoutes = require('../routes/userRoutes');

// Use Routes
app.use('/api/settings', settingsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send('VFG Backend running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
