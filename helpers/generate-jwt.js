const jwt = require("jsonwebtoken");

const { types } = require("../types/types");

const generateJWT = (id, username, time) => {
  return new Promise((resolve, reject) => {
    const payload = { id, username };
    jwt.sign(
      payload,
      types.secretToken,
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
