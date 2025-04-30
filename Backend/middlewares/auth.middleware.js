require("dotenv").config();
var jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(404).json({ msg: "Token Not Found, Please Try Again" });
    } else {
      var decoded = jwt.verify(token, JWT_SECRET_KEY);
        if (decoded) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(401).json({ msg: "Not Unauthorized" });
      }
    }
  } catch (error) {
    // console.log(error)
    res.status(500).json({ msg: "Something Went Wrong, Please Try Again" });
  }
};

module.exports = authMiddleware;
