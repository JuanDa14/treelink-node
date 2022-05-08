const { types } = require("../types/types");

const generatelinkVerified = (token) =>
  types.baseUrl + types.verifiedEmail + token;

const generateForgotPassword = (token) =>
  types.baseUrl + types.forgotPassword + token;

module.exports = {
  generatelinkVerified,
  generateForgotPassword,
};
