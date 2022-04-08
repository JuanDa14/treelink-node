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
  loginFacebook,
} = require("../controllers/user");

//TODO: Validaciones en la db
const { existsEmail } = require("../helpers/dbvalidations");
const { validationsReq } = require("../middlewares/validate-req");
//********************/

//TODO: Middlewares
const { verifyToken } = require("../middlewares/verify-token");
/*********************/

//TODO variables de  entorno
const refreshToken = process.env.REFRESH_TOKEN;
const secretToken = process.env.SECRET_TOKEN;
const verifiedEmail = process.env.VERIFIED_EMAIL;

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

router.post("/confirm-email", verifyToken(verifiedEmail), verifyEmail);

router.post(
  "/login",
  [
    check("email", "Email is required").notEmpty().isEmail(),
    check("password", "Password is required").notEmpty().isLength({ min: 6 }),
    validationsReq,
  ],
  login
);

router.get("/refresh", verifyToken(refreshToken), getUserRefresh);

//TODO: Login con Google
// router.post(
//   "/google",
//   [check("tokenId", "tokenId is required").notEmpty(), validationsReq],
//   loginGoogle
// );

//TODO: Login con facebook
// router.post(
//   "/facebook",
//   [
//     check("username", "UserName is required").notEmpty(),
//     check("id", "Id is required").notEmpty(),
//     validationsReq,
//   ],
//   loginFacebook
// );

//TODO: Restaurar contraseña
// router.post(
//   "/forgotpassword",
//   [check("email", "Email is required").notEmpty().isEmail(), validationsReq],
//   forgotPassword
// );

// router.put(
//   "/resetpassword",
//   [
//     check("password", "Password is required").notEmpty().isLength({ min: 6 }),
//     validationsReq,
//     verifyToken,
//   ],
//   resetPassword
// );

module.exports = router;
