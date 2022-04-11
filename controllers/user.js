const bcrypt = require("bcrypt");

//TODO: Helpers
const { generateJWT } = require("../helpers/generate-jwt");
const { sendEmail } = require("../helpers/nodemailer");

/********************/

//TODO variables de entorno
const { types } = require("../types/types");
/*******************/

//TODO: Modelos
const User = require("../models/user");
/*******************/

//TODO: login con contraseña
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const verifiedPassword = bcrypt.compareSync(password, user.password);

    if (!(user.verified || user || verifiedPassword))
      return res
        .status(400)
        .json({ ok: false, message: "Wrong username or password" });

    const { username, _id } = user;

    const token = await generateJWT(_id, username, "4h");

    return res.status(200).json({
      ok: true,
      id: _id,
      username,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

//TODO registrar usuario
const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = new User({ username, email, password });

    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);

    const token_link = await generateJWT(user._id, user.username, "10m");

    const verified_link = `${types.baseUrl}${types.verifiedEmail}${token_link}`;

    user.linkVerified = verified_link;

    await user.save();

    await sendEmail(
      "validate-email",
      username,
      verified_link,
      email,
      "Verified your Email"
    );

    return res.status(200).json({
      ok: true,
      message: "¡ Check your email !",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

//TODO: Validar email
const verifyUserEmail = async (req, res) => {
  const { id, username } = req;

  const { linkVerified } = req.body;

  try {
    const user = await User.findById(id);

    if (!user || user.linkVerified !== linkVerified || user.verified) {
      return res
        .status(404)
        .json({ ok: false, message: "An error has occurred" });
    }

    user.verified = true;
    user.linkVerified = "";

    await user.save();

    const token = await generateJWT(id, username, "4h");

    return res.status(200).json({
      ok: true,
      id,
      username,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

//TODO revalidar token
const getUserRefresh = async (req, res) => {
  const { id, username } = req;

  try {
    const token = await generateJWT(id, username, "4h");

    return res.status(200).json({ ok: true, id, username, token });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

//TODO: Login con google
const loginUserGoogle = async (req, res) => {
  const { username, picture, email } = req;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username,
        email,
        google: true,
        password: types.defaultPassword,
      });

      const token_link = await generateJWT(user._id, user.username, "10m");

      const verified_link = `${types.baseUrl}${types.verifiedEmail}${token_link}`;

      user.linkVerified = verified_link;

      await user.save();

      await sendEmail(
        "validate-email",
        user.username,
        verified_link,
        user.email,
        "Validate Email"
      );

      return res.status(200).json({ ok: true, msg: "¡ Check your email !" });
    }

    if (!user.verifyEmail && user.google) {
      return res.status(403).json({ ok: false, msg: "An error has occurred" });
    }

    const token = await generateJWT(user._id, user.username, "4h");

    return res
      .status(200)
      .json({ ok: true, id: user._id, username: user.username, token });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

//TODO: Restablecer contraseña
const forgotUserPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!(user || user.verified) || user.google) {
      return res.status(500).json({ ok: false, msg: "An error has occurred" });
    }

    const token_link = await generateJWT(user._id, user.username, "10m");

    const forgot_link = `${types.baseUrl}${types.forgotPassword}${token_link}`;

    user.forgotPassword = forgot_link;

    await user.save();

    await sendEmail(
      "forgot-password",
      user.username,
      forgot_link,
      user.email,
      "Recover Password"
    );

    return res.status(200).json({ ok: true, msg: "¡ Check your email !" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

const resetUserPassword = async (req, res) => {
  const { id } = req;

  const { forgotPassword, password } = req.body;

  try {
    const user = await User.findById(id);

    if (user.resetLink === "" || user.forgotPassword !== forgotPassword)
      return res.status(401).json({
        ok: false,
        message: "An error has occurred",
      });

    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);

    user.forgotPassword = "";

    await user.save();

    return res
      .status(200)
      .json({ ok: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

//TODO: Login con facebook
const loginUserFacebook = async (req, res) => {
  const { username, id } = req.body;

  try {
    let user = await User.findOne({ email: id });

    if (!user) {
      user = new User({
        email: id,
        username,
        password: types.defaultPassword,
        verified: true,
      });

      await user.save();
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ ok: false, message: "An error has occurred" });
    }

    const token = await generateJWT(user._id, user.username, "4h");

    return res
      .status(200)
      .json({ ok: true, id: user._id, username: user.username, token });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserRefresh,
  loginUserGoogle,
  loginUserFacebook,
  forgotUserPassword,
  resetUserPassword,
  verifyUserEmail,
};
