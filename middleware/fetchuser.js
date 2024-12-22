require("dotenv").config();
const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  // Get user from jwt token and add id to req object
  // 401 access denied
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Plaese authenticate using valid token" });
  }
  try {
    //verify and decode user data
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Plaese authenticate using valid token" });
  }
};

module.exports = fetchuser;
