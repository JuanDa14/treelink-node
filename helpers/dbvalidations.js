const Link = require("../models/link");
const User = require("../models/user");

const notExistsLink = async (id) => {
  const link = await Link.findById(id);
  if (!link) {
    throw new Error("Link not found");
  }
};

const existsEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("An error has occurred");
  }
};

module.exports = {
  notExistsLink,
  existsEmail,
};
