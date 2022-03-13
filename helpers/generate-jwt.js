const jwt = require("jsonwebtoken");

const generateJWT = (uid, username) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username };
    jwt.sign(
      payload,
      process.env.SECRET_TOKEN,
      {
        expiresIn: "2h",
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
