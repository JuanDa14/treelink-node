const { Schema, model } = require("mongoose");

const todoSchema = Schema({
  title: {
    type: String,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
  },

  date: {
    type: Date,
    required: true,
  },

  description: {
    type: String,
  },
});

module.exports = model("Todo", todoSchema);
