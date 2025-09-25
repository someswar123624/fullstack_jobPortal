const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey"; // move to .env in production

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET_KEY, { expiresIn: "1h" });
};

module.exports = generateToken;
