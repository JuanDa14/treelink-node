const { response } = require("express");
const { verifyToken } = require("../helpers/verify-token");

const Todo = require("../models/todo");

const getTodos = async (req, res = response) => {
  const token = req.header("x-token");

  try {
    const verify = verifyToken(token);

    if (!verify) {
      return res.status(400).json({ ok: false, msg: "token no es valido" });
    }

    const { uid } = verify;

    const todos = await Todo.find({ userId: uid });

    res.status(200).json({ ok: true, todos });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const updatedTodo = async (req, res = response) => {
  const { id } = req.params;
  const token = req.header("x-token");

  try {
    const verify = verifyToken(token);

    if (!verify) {
      return res.status(400).json({ ok: false, msg: "token no es valido" });
    }

    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ ok: true, todo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const removeTodo = async (req, res = response) => {
  const { id } = req.params;
  const token = req.header("x-token");

  try {
    const verify = verifyToken(token);

    if (!verify) {
      return res.status(400).json({ ok: false, msg: "token no es valido" });
    }

    const todo = await Todo.findByIdAndDelete(id, { new: true });

    res.status(200).json({ ok: true, todo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const createTodo = async (req, res = response) => {
  const { title, date, description = "" } = req.body;
  const token = req.header("x-token");

  try {
    const verify = verifyToken(token);

    if (!verify) {
      return res.status(400).json({ ok: false, msg: "token no es valido" });
    }

    const todo = new Todo({ title, description, userId: verify.uid, date });

    todo.save();

    res.status(200).json({ ok: true, todo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

module.exports = { getTodos, updatedTodo, removeTodo, createTodo };
