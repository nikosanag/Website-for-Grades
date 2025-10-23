const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const gradeRoute = require('./routes/gradeRoute');

const app = express();
const PORT = 3008;

// Enable CORS for development
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.MONGO_URI || 'mongodb://grade-database:27017/gradedb';

mongoose.connect(uri)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use(gradeRoute);

// Start server when Mongo is ready
mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`🚀 Grade service running at http://localhost:${PORT}`);
    });
});
