const { Schema, model } = require("mongoose");

const linkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },

    url: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      default: "",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Link", linkSchema);
