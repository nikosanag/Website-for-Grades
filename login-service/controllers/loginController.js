const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ role: 'none', error: 'Missing identifier or password' });
    }

    try {
        let user;

        // Βρες user μόνο με βάση το id ή username, ΧΩΡΙΣ password
        if (!isNaN(identifier)) {
            user = await User.findOne({ id: Number(identifier) });
        } else {
            user = await User.findOne({ username: identifier });
        }

        if (!user) {
            return res.status(401).json({ role: 'none', error: 'Invalid credentials' });
        }

        // Σύγκρινε το password με το hashed password στη βάση
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ role: 'none', error: 'Invalid credentials' });
        }

        // Δημιουργία JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role, jti: crypto.randomUUID() },
                               JWT_SECRET,
                               { expiresIn: '1h' }
        );

        return res.json({ role: user.role, token });
    } catch (err) {
        console.error('❌ Login error:', err);
        return res.status(500).json({ role: 'none', error: 'Internal server error' });
    }
};

module.exports = {
    login
};
