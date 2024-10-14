const { Router } = require("express");
const jwt = require("jsonwebtoken");

const { Users } = require("../db/index");
const { customError } = require("../utils/customError");

const authRouter = Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

authRouter.post("/signup", async (req, res, next) => {
  const { username, useremail, password } = req.body;
  if (!useremail || !username || !password) {
    return next(customError(411, "Invalid Details"));
  }
  try {
    const existingUser = await Users.findOne({ useremail: useremail });
    if (existingUser) {
      return next(customError(411, "User already exists"));
    }
    const newUser = {
      useremail,
      username,
      password,
    };
    await Users.create(newUser);
    return res.json({
      message: "user created succesfully!",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/signin", async (req, res, next) => {
  const { useremail, password } = req.body;
  try {
    const existingUser = await Users.findOne({
      useremail: useremail,
      password: password,
    });
    if (!existingUser) {
      return next(customError(411, "user does not exists!"));
    }
    const token = jwt.sign(
      {
        username: existingUser.username,
        useremail: useremail,
        password: password,
      },
      jwtSecretKey
    );
    return res.json({
      message: "sign in successfull!",
      token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;
