// Auth Middleware (Protect routes + check Redis blacklist)
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');

async function authmiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const isBlacklisted = await redisClient.get(decoded.jti);

    if (isBlacklisted) {
      return res.status(401).json({ message: "Token expired (blacklisted)" });
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authmiddleware;