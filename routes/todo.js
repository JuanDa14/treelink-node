const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  getTodos,
  createTodo,
  updatedTodo,
  removeTodo,
} = require("../controllers/todo");

const { existsTodo } = require("../helpers/dbvalidations");

//TODO: Middlewares
const { verifyToken } = require("../middlewares/verify-token");
const { validationsReq } = require("../middlewares/validate-fields");
//************************/

//TODO: validando el token
router.use(verifyToken);
//************************/

//TODO: RUTAS
/***********************/

router.get("/", getTodos);

router.post(
  "/",
  [
    check("title", "Title is required").notEmpty(),
    check("date", "Date is required").notEmpty().isDate(),
    check("userId", "userId is required").notEmpty(),
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
