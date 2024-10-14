const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../utils/authenticateUser");
const { Users, Todos } = require("../db/index");
const { customError } = require("../utils/customError");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const todosRouter = Router();

todosRouter.get("/", authenticateUser, async (req, res, next) => {
  //return all the todos of the current user.
  const token = req.headers.authorization;
  const { useremail } = jwt.decode(token, jwtSecretKey);
  const user = await Users.findOne({ useremail });
  const result = await Todos.find({
    _id: { $in: user.createdTodo },
  });
  res.json({
    message: "here are all the todos!",
    result,
  });
});

todosRouter.get("/:todoId", authenticateUser, async (req, res, next) => {
  const todoId = req.params.todoId;
  try {
    const todo = await Todos.findOne({ _id: todoId });
    if (!todo) {
      return next(customError(413, "No todo with the requested id!"));
    }
    res.json({
      message: "here is your todo!",
      data: todo,
    });
  } catch (err) {
    next(err);
  }
});

todosRouter.post("/create", authenticateUser, async (req, res, next) => {
  const { title, description, completed } = req.body;
  if (!title || !description) {
    return next(customError(411, "Invalid Inputs!"));
  }
  try {
    const token = req.headers.authorization;
    const { useremail } = jwt.decode(token, jwtSecretKey);
    console.log(useremail);
    const newTodo = await Todos.create({
      title,
      description,
      completed,
    });
    await Users.updateOne(
      {
        useremail,
      },
      {
        $push: {
          createdTodo: newTodo._id,
        },
      }
    );
    res.json({
      message: "todo created successfully",
    });
  } catch (err) {
    next(err);
  }
});

todosRouter.post(
  "/updatetodo/:todoId",
  authenticateUser,
  async (req, res, next) => {
    const todoId = req.params.todoId;
    try {
      //first check wether the todo exists.
      const todo = await Todos.findOne({ _id: todoId });
      if (!todo) {
        return next(
          customError(413, "Todo with the requested id does not exists!")
        );
      }
      await Todos.updateOne(
        {
          _id: todoId,
        },
        {
          completed: true,
        }
      );
      res.json({
        message: "todo was updated succesfully!",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = todosRouter;
