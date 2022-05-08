const { Schema, model } = require("mongoose");

const linkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    img: {
      type: String,
      default: null,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Link", linkSchema);
