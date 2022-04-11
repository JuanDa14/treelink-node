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
const { existsEmail } = require("../helpers");
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
    check("username", "Username is required").notEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    check("email").custom(existsEmail),
    validationsReq,
  ],
  registerUser
);

router.post(
  "/confirm-email",
  [
    verifyToken,
    check("linkVerified", "LinkVerified is required").notEmpty(),
    validationsReq,
  ],
  verifyUserEmail
);

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
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
    check("username", "UserName is required").notEmpty(),
    check("id", "Id is required").notEmpty(),
    validationsReq,
  ],
  loginUserFacebook
);

//TODO: Restaurar contraseña
router.post(
  "/forgot-password",
  [check("email", "Email is required").isEmail(), validationsReq],
  forgotUserPassword
);

router.put(
  "/reset-password",
  [
    verifyToken,
    check("forgotPassword", "Forgot password link is required").notEmpty(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    validationsReq,
  ],
  resetUserPassword
);

module.exports = router;
