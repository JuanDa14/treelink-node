const { validationResult } = require("express-validator");

const validationsReq = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, ...errors });
  }

  next();
};

module.exports = { validationsReq };
