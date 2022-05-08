const Link = require("../models/link");
const User = require("../models/user");

const notExistLink = async (id) => {
  const link = await Link.findById(id);

  if (!link) {
    throw new Error("The link does not exist");
  }
};

const isExistEmail = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    throw new Error("Email already exists");
  }
};

module.exports = {
  notExistLink,
  isExistEmail,
};
