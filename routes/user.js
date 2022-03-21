const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  login,
  register,
  getUserRefresh,
  loginGoogle,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/user");

//TODO: Validaciones en la db
const { existsEmail } = require("../helpers/dbvalidations");
//********************/

//TODO: Middlewares
const { verifyToken } = require("../middlewares/verify-token");
const { validationsReq } = require("../middlewares/validate-fields");
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

//Verificar email
router.post("/confirm-email", verifyToken, verifyEmail);

router.post(
  "/login",
  [
    check("email", "Email is required").notEmpty().isEmail(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    validationsReq,
  ],
  login
);

router.get("/token", verifyToken, getUserRefresh);

//TODO: Login con Google
router.post(
  "/google",
  [check("tokenId", "tokenId is required").notEmpty(), validationsReq],
  loginGoogle
);

//TODO: Restaurar contraseña
router.post(
  "/forgotpassword",
  [check("email", "Email is required").notEmpty().isEmail(), validationsReq],
  forgotPassword
);

router.put(
  "/resetpassword",
  [
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    validationsReq,
    verifyToken,
  ],
  resetPassword
);

module.exports = router;
