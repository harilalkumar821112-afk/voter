const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
    { expiresIn: "7d" }
  );
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (err) {
    return null;
  }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your-refresh-secret");
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
