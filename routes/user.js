const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { login, register, verifyJWT } = require("../controllers/user");

//TODO: Validaciones en la db
const { validationsReq, existsEmail } = require("../helpers/dbvalidations");
//********************/

//TODO: Middlewares
const { verifyToken } = require("../middlewares/verify-token");
/*********************/

//TODO: Rutas
router.post(
  "/register",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required").notEmpty().isEmail(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    check("email").custom(existsEmail),
    validationsReq,
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Email is required").notEmpty().isEmail(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    validationsReq,
  ],
  login
);

router.post("/token", verifyToken, verifyJWT);

module.exports = router;
