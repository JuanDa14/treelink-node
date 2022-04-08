const jwt = require("jsonwebtoken");

const verifyToken = (secretToken) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization").split(" ")[1];
      
      if (!token) {
        return res.status(400).json({ ok: false, message: "Token not sent" });
      }

      const user = jwt.verify(token, secretToken);

      if (!user) {
        return res.status(401).json({ ok: false, message: "Token invalid" });
      }

      req.user = user;

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, message: "There was a problem with your access" });
    }
  };
};

module.exports = { verifyToken };
