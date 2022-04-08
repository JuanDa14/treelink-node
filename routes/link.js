const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

//TODO: Middlewares
const { verifyToken } = require("../middlewares/verify-token");

//TODO Controllers
const {
  postLink,
  getLinks,
  updateLink,
  deleteLink,
} = require("../controllers/link");

const { validationsReq } = require("../middlewares/validate-req");
const { validateFile } = require("../middlewares/validate-file");

const { notExistsLink } = require("../helpers/dbvalidations");
//************************/

//TODO : variables de  entorno
const refreshToken = process.env.REFRESH_TOKEN;
//************************/

//TODO: validando el token
router.use(verifyToken(refreshToken));
//************************/

//TODO: RUTAS
/***********************/

router.get("/", getLinks);

router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("url", "La url es obligatoria").not().isEmpty(),
    // validateFile,
    validationsReq,
  ],
  postLink
);

router.put(
  "/:id",
  [
    check("id", "El id es obligatorio").isMongoId(),
    check("id").custom(notExistsLink),
    validationsReq,
  ],
  updateLink
);

router.delete(
  "/:id",
  [
    check("id", "El id es obligatorio").isMongoId(),
    check("id").custom(notExistsLink),
    validationsReq,
  ],
  deleteLink
);

module.exports = router;
