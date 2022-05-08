const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dbvyaguam/image/upload/v1650761674/user_not_found_opkceh.webp",
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
      required: true,
      unique: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    tokenConfirm: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = bcrypt.genSaltSync();

  user.password = bcrypt.hashSync(user.password, salt);

  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = model("User", userSchema);
