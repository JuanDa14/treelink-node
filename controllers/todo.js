const Todo = require("../models/todo");

const getTodos = async (req, res) => {
  const uid = req.uid;

  try {
    const todos = await Todo.find({ userId: uid });

    res.status(200).json({ ok: true, todos });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const createTodo = async (req, res = response) => {
  const { title, date, description = "" } = req.body;

  const userId = req.uid;

  try {
    const todo = new Todo({ title, description, userId, date });

    await todo.save();

    res.status(200).json({ ok: true, todo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const updatedTodo = async (req, res = response) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findByIdAndUpdate(id, req.body);

    res.status(200).json({ ok: true, todo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const removeTodo = async (req, res = response) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findByIdAndDelete(id);

    res.status(200).json({ ok: true, todo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

module.exports = { getTodos, updatedTodo, removeTodo, createTodo };
