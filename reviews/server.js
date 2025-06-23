require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
// Enable CORS for all origins (development)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(express.json());
app.use('/api', reviewRoutes);

const PORT = process.env.PORT || 3005;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Review service running at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
