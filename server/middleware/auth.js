const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    console.log("Token found:", token);

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Verify the token
    req.userId = decoded?.id; // Attach user ID to the request object

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

module.exports = auth;