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
      minlength: 6,
    },

    state: {
      type: Boolean,
      default: true,
    },

    google: {
      type: Boolean,
      default: false,
    },

    forgotPassword: {
      type: String,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    linkVerified: {
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
