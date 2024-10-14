const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function authenticateUser(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decodedValue = jwt.verify(token, jwtSecretKey);
    if (decodedValue.useremail) {
      next();
    } else {
      res.status(411).json({
        message: "You are not authenticated!",
      });
    }
  } catch (err) {
    res.status(411).json({
      message: "Invalid Inputs",
    });
  }
}

module.exports = {
  authenticateUser,
};
