const { validationResult } = require("express-validator");

const User = require("../models/user");
const Todo = require("../models/todo");

const validationsReq = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, ...errors });
  }

  next();
};

const existsEmail = async (email = "") => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("El email ya existe");
  }
};

const existsTodo = async (id) => {
  const existTodo = await Todo.findById(id);

  if (!existTodo) {
    throw new Error("El todo no existe");
  }
};

module.exports = { validationsReq, existsEmail, existsTodo };
