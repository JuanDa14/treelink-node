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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
