const { Schema, model } = require("mongoose");

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
    },

    pending: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Todo", todoSchema);
