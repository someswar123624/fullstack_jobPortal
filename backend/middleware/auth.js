const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if(!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if(err) return res.status(403).json({ success: false, message: "Token invalid" });
    req.user = decoded; // id & role
    next();
  });
};

module.exports = authenticateToken;
