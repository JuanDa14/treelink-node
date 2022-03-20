const jwt = require("jsonwebtoken");

const generateJWT = (uid, username, condition) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username };
    jwt.sign(
      payload,
      process.env.SECRET_TOKEN,
      {
        expiresIn: condition ? "4h" : "5m",
      },
      (error, token) => {
        if (!error) {
          resolve(token);
        } else {
          reject(error);
        }
      }
    );
  });
};

module.exports = { generateJWT };
