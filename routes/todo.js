const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  getTodos,
  createTodo,
  updatedTodo,
  removeTodo,
} = require("../controllers/todo");
const { validationsReq, existsTodo } = require("../helpers/dbvalidations");

router.get(
  "/",
  [check("x-token", "Token is required").notEmpty(), validationsReq],
  getTodos
);

router.post(
  "/",
  [
    check("title", "Title is required").notEmpty(),
    check("date", "Date is required").notEmpty().isDate(),
    validationsReq,
  ],
  createTodo
);

router.put(
  "/:id",
  [
    check("id", "Id is required").notEmpty(),
    check("id").custom(existsTodo),
    validationsReq,
  ],
  updatedTodo
);

router.delete(
  "/:id",
  [
    check("id", "Id is required").notEmpty(),
    check("id").custom(existsTodo),
    validationsReq,
  ],
  removeTodo
);

module.exports = router;
