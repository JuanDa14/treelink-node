const router = require("express").Router();

const { check } = require("express-validator");

//TODO Controllers
const {
  getUserLinks,
  createUserLink,
  updateUserLink,
  deleteUserLink,
} = require("../controllers/link");

//TODO: Helpers
const { notExistLink } = require("../helpers");
/***********************/

//TODO: Middlewares
const { verifyToken, validationsReq, validateFile } = require("../middlewares");

/***********************/

//TODO: validando el token
router.use(verifyToken);
/***********************/

//TODO: RUTAS

router.get("/", getUserLinks);

router.post(
  "/",
  [
    check("title", "The title is required").trim().notEmpty(),
    check("url", "The url is required").trim().notEmpty(),
    validateFile,
    validationsReq,
  ],
  createUserLink
);

router.put(
  "/:id",
  [
    check("id", "An error has occurred").isMongoId(),
    check("id").custom(notExistLink),
    validationsReq,
  ],
  updateUserLink
);

router.delete(
  "/:id",
  [
    check("id", "An error has occurred").isMongoId(),
    check("id").custom(notExistLink),
    validationsReq,
  ],
  deleteUserLink
);

module.exports = router;
