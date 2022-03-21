const jwt = require("jsonwebtoken");

const generateJWT = (uid, username, time) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, username };
    jwt.sign(
      payload,
      process.env.SECRET_TOKEN,
      {
        expiresIn: time,
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
