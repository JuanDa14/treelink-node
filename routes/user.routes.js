const router = require("express").Router();

const { check } = require("express-validator");

const {
  loginUser,
  registerUser,
  getUserRefresh,
  loginUserGoogle,
  loginUserFacebook,
  forgotUserPassword,
  resetUserPassword,
  verifyUserEmail,
} = require("../controllers/user");

//TODO: Helpers
const { isExistEmail } = require("../helpers");
/*********************/

//TODO: Middlewares
const {
  validationsReq,
  verifyToken,
  verifyTokenGoogle,
} = require("../middlewares");
/*********************/

//TODO: Rutas
router.post(
  "/register",
  [
    check("username", "The username is required").trim().notEmpty(),
    check("email", "The email is required").trim().isEmail().normalizeEmail(),
    check("password", "The password is required")
      .trim()
      .notEmpty()
      .isLength({ min: 6 }),
    check("email").custom(isExistEmail),
    validationsReq,
  ],
  registerUser
);

//Todo confirmar email
router.get(
  "/confirm-email/:tokenConfirm",
  [
    check("tokenConfirm", "Error with email confirmation").trim().notEmpty(),
    validationsReq,
  ],
  verifyUserEmail
);

//TODO: Login
router.post(
  "/login",
  [
    check("email", "The email is required").trim().isEmail().normalizeEmail(),
    check("password", "The password is required")
      .trim()
      .notEmpty()
      .isLength({ min: 6 }),
    validationsReq,
  ],
  loginUser
);

router.get("/refresh-user", verifyToken, getUserRefresh);

//TODO: Login con Google

router.post("/login-google", verifyTokenGoogle, loginUserGoogle);

//TODO: Login con facebook

router.post(
  "/login-facebook",
  [
    check("username", "The username is required").trim().notEmpty(),
    check("email", "The email is required").trim().isEmail().normalizeEmail(),
    validationsReq,
  ],

  loginUserFacebook
);

//TODO: Restaurar contraseña
router.post(
  "/forgot-password",
  [
    check("email", "The email is required").trim().isEmail().normalizeEmail(),
    validationsReq,
  ],
  forgotUserPassword
);

router.put(
  "/reset-password",
  [
    check("forgotPassword", "Error with password recovery").trim().notEmpty(),
    check("password", "The password is required")
      .trim()
      .notEmpty()
      .isLength({ min: 6 }),
    validationsReq,
  ],
  resetUserPassword
);

module.exports = router;
