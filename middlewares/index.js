const validateReq = require("../middlewares/validate-req");
const verifyToken = require("../middlewares/verify-token");
const verifyTokenGoogle = require("../middlewares/verify-token-google");
const validateFile = require("../middlewares/validate-file");

module.exports = {
  ...validateReq,
  ...verifyToken,
  ...verifyTokenGoogle,
  ...validateFile,
};
