const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    const verify = jwt.verify(token, process.env.SECRET_TOKEN);
    
    return verify;
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Token no valido" });
  }
};

module.exports = { verifyToken };
