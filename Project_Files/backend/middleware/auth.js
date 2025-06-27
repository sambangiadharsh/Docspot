const jwt = require('jsonwebtoken');
module.exports = (role) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role && role && decoded.role !== role) return res.status(403).json({ message: 'Forbidden' });
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid Token' });
    }
  }
};