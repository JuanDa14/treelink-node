const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res.status(400).json({ ok: false, msg: "Token not sent" });
    }

    const { uid, username } = jwt.verify(token, process.env.SECRET_TOKEN);

    req.uid = uid;
    req.username = username;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, msg: "There was a problem with your access" });
  }
};

module.exports = { verifyToken };
