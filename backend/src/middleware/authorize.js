const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: 'Access denied. No role assigned.' });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = authorize;
