const jwt = require("jsonwebtoken");

const generateJWT = (id, username, time, secretToken) => {
  return new Promise((resolve, reject) => {
    const payload = { id, username };
    jwt.sign(
      payload,
      secretToken,
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
