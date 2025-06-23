const redisClient = require('../utils/redisClient');

const logout = async (req, res) => {
    const token = req.headers["x-observatory-auth"];
    if (!token) {
        return res.status(400).json({ message: 'Token is required to logout' });
    }

    try {
        // Set token in Redis as blacklisted, expiring after 1 hour
        await redisClient.set(`blacklist:${token}`, 'true', { EX: 3600 });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('❌ Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
    }
};

module.exports = {
    logout
};
