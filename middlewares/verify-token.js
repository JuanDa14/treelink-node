const jwt = require("jsonwebtoken");

const { types } = require("../types/types");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token)
    return res.status(400).json({ ok: false, message: "Token not sent" });

  try {
    const { username, id } = jwt.verify(token, types.secretToken);

    if (!(username && id))
      return res.status(401).json({ ok: false, message: "Token invalid" });

    req.username = username;
    req.id = id;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "There was a problem with your access" });
  }
};

module.exports = { verifyToken };
