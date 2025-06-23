// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redisClient");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    const token = req.headers["x-observatory-auth"];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Check if token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(403).json({ message: "Token is invalid (Logged out)." });
        }

        // Verify the token and attach user info to the request object
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Token verification error:", err);
        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = { authenticateToken };
