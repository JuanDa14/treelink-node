const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    state: {
      type: Boolean,
      default: true,
    },

    google: {
      type: Boolean,
      default: false,
    },

    resetLink: {
      type: String,
      default: "",
    },

    verifyEmail: {
      type: Boolean,
      default: false,
    },

    linkVerifyEmail: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
