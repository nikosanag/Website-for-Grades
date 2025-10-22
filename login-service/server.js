// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');


// Import the login and logout routes
const loginRoute = require('./routes/loginRoute');
const logoutRoute = require('./routes/logoutRoute');

const app = express();
const PORT = 3001;

// Enable CORS for all origins (development)
app.use(cors({
  origin: 'http://192.168.2.11:3000',
  credentials: true
}));

app.use(bodyParser.json());


// MongoDB connection URI
const uri = 'mongodb://login-database:27017/logindb';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Use login and logout routes
app.use(loginRoute);
app.use(logoutRoute);

// Start server after DB connection is ready
mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`🚀 Login service running at http://192.168.2.11:${PORT}`);
    });
});
