const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  console.log("Authorization header:", req.header("Authorization"));
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
