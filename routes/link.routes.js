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
const { notExistsLink } = require("../helpers");
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
    check("title", "Title is required").notEmpty(),
    check("url", "Url is required").notEmpty(),
    validateFile,
    validationsReq,
  ],
  createUserLink
);

router.put(
  "/:id",
  [
    check("id", "Id is required").isMongoId(),
    check("id").custom(notExistsLink),
    validationsReq,
  ],
  updateUserLink
);

router.delete(
  "/:id",
  [
    check("id", "Id is required").isMongoId(),
    check("id").custom(notExistsLink),
    validationsReq,
  ],
  deleteUserLink
);

module.exports = router;
