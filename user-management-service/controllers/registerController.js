const bcrypt = require('bcrypt');
const User = require('../models/User');
const { publishUserEvent } = require('../utils/publisher');

const SALT_ROUNDS = 10;

const register = async (req, res) => {
    if (!req.user || req.user.role != 'Representative') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { role, username, password, id } = req.body;

    if (!role || !username || !password || !id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { id }]
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username or ID already exists' });
        }

        // Hash password πριν αποθήκευση
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({ role, username, password: hashedPassword, id });
        const savedUser = await newUser.save();

        await publishUserEvent('user.created', {
            id: savedUser.id,
            username: savedUser.username,
            role: savedUser.role,
            password: savedUser.password
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Register error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const registerWithRandomId = async (req, res) => {
    if (!req.user || req.user.role !== 'Representative') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { role, username, password } = req.body;

    if (!role || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const userWithSameUsername = await User.findOne({ username });
        if (userWithSameUsername) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        let uniqueId, tries = 0;
        do {
            uniqueId = generateRandomId();
            var userWithSameId = await User.findOne({ id: uniqueId });
            tries++;
            if (tries > 100) {
                return res.status(500).json({ error: 'Failed to generate unique ID' });
            }
        } while (userWithSameId);

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({ role, username, password: hashedPassword, id: uniqueId });
        const savedUser = await newUser.save();

        await publishUserEvent('user.created', {
            id: savedUser.id,
            username: savedUser.username,
            role: savedUser.role,
            password: savedUser.password,
        });

        return res.status(201).json({ message: 'User registered successfully', id: savedUser.id });
    } catch (error) {
        console.error('❌ Register (random ID) error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUserPassword = async (req, res) => {
    if (!req.user || req.user.role !== 'Representative') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { role, username, password, id } = req.body;

    if (!role || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = { role, username };
        if (id && id !== '') {
            query.id = id;
        }

        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ error: 'User not found or ID mismatch' });
        }

        // Hash νέο password πριν αποθήκευση
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        user.password = hashedPassword;

        const updatedUser = await user.save();

        console.log('✅ Updated user:', updatedUser);

        await publishUserEvent('user.updated', {
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role,
            password: updatedUser.password
        });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('❌ Password update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const generateRandomId = () => {
    return '0' + Math.floor(1000000 + Math.random() * 9000000).toString();
};

module.exports = {
    register,
    registerWithRandomId,
    updateUserPassword
};
