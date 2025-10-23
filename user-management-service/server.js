// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const registerRoute = require('./routes/registerRoute');

const app = express();
const PORT = 3004;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());

// MongoDB connection URI
const uri = 'mongodb://user-management-database:27017/userdb';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use(registerRoute);

// Start server after DB connection is ready
mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`🚀 User Managment service running at http://localhost:${PORT}`);
    });
});
