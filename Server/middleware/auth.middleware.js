const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: "No token provided" });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: "Invalid token format" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) return res.status(401).json({ error: "User not found" });

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (err) {
      res.status(401).json({ error: "Unauthorized: " + err.message });
    }
  };
};

module.exports = auth;
