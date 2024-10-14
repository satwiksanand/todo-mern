const mongoose = require("mongoose");
const connectionUrl = process.env.DATABASE_URL;

//connect to the database.
mongoose
  .connect(connectionUrl)
  .then(() => {
    console.log("connection to the database succesfull!");
  })
  .catch((err) => {
    console.log(err);
  });

//schemas
const userSchema = new mongoose.Schema({
  useremail: String,
  username: String,
  password: String,
  createdTodo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Users = mongoose.model("users", userSchema);
const Todos = mongoose.model("todos", todoSchema);

module.exports = {
  Users,
  Todos,
};
