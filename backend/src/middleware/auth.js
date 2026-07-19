const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role }]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid token or user inactive.' });
    }

    req.user = user;
    req.userRole = user.Role.name;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
