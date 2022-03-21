const User = require("../models/user");
const Todo = require("../models/todo");

const existsEmail = async (email = "") => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error("Email already registered");
  }
};

const existsTodo = async (id) => {
  const existTodo = await Todo.findById(id);

  if (!existTodo) {
    throw new Error("The todo does not exist");
  }
};

module.exports = { existsEmail, existsTodo };
