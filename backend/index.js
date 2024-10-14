require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth");
const todosRouter = require("./routes/todos");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/todos", todosRouter);

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message ? err.message : "something up with the server",
  });
});

app.listen(PORT, () => {
  console.log(`the server is listening on port ${PORT}!`);
});
