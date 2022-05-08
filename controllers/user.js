const { v4: uuidv4 } = require("uuid");

//TODO: Helpers
const {
  generateForgotPassword,
  generatelinkVerified,
  generateJWT,
  sendEmail,
} = require("../helpers");

/********************/

//TODO: Modelos
const User = require("../models/user");

/*******************/

//TODO: login con contraseña
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password))
      return res.status(401).json({
        ok: false,
        message: "Email or password incorrect",
      });

    if (!user.verified)
      return res.status(401).json({
        ok: false,
        message: "Verify your email",
      });

    if (user.google)
      return res.status(401).json({
        ok: false,
        message: "Google account, please login with google",
      });

    const { username, _id, picture } = user;

    const token = await generateJWT(_id, username, "4h");

    return res.status(200).json({
      ok: true,
      id: _id,
      picture,
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
        picture,
        password: "123456",
        forgotPassword: uuidv4(),
        tokenConfirm: uuidv4(),
      });

      await user.save();

      const link = generatelinkVerified(user.tokenConfirm);

      await sendEmail(
        "validate-email",
        user.username,
        link,
        user.email,
        "Validate Email"
      );

      return res
        .status(200)
        .json({ ok: true, message: "¡ Check your email !" });
    }

    if (!user.verified)
      return res.status(401).json({ ok: false, message: "Verify your email" });

    if (!user.google)
      return res
        .status(401)
        .json({ ok: false, message: "Email already exists" });

    const token = await generateJWT(user._id, user.username, "4h");

    return res.status(200).json({
      ok: true,
      id: user._id,
      username: user.username,
      picture: user.picture,
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
    const user = new User({
      username,
      email,
      password,
      forgotPassword: uuidv4(),
      tokenConfirm: uuidv4(),
    });

    await user.save();

    const link = generatelinkVerified(user.tokenConfirm);

    console.log(link);

    await sendEmail(
      "validate-email",
      username,
      link,
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
  const { tokenConfirm } = req.params;

  try {
    const user = await User.findOne({ tokenConfirm });

    if (!user || user.tokenConfirm !== tokenConfirm || user.verified) {
      return res
        .status(404)
        .json({ ok: false, message: "An error has occurred" });
    }

    user.verified = true;

    await user.save();

    const token = await generateJWT(user._id, user.username, "4h");

    return res.status(200).json({
      ok: true,
      id: user._id,
      user: user.username,
      picture: user.picture,
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
    const { picture } = await User.findById(id);

    const token = await generateJWT(id, username, "4h");

    return res.status(200).json({ ok: true, id, username, picture, token });
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

    if (!(user || user.verified) || user.google)
      return res
        .status(404)
        .json({ ok: false, message: "An error has occurred" });

    const link = generateForgotPassword(user.forgotPassword);

    await user.save();

    await sendEmail(
      "forgot-password",
      user.username,
      link,
      user.email,
      "Recover Password"
    );

    return res.status(200).json({ ok: true, message: "¡ Check your email !" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

const resetUserPassword = async (req, res) => {
  const { forgotPassword } = req.params;

  const { password } = req.body;

  try {
    const user = await User.findOne({ forgotPassword });

    if (user.forgotPassword !== forgotPassword)
      return res.status(401).json({
        ok: false,
        message: "An error has occurred",
      });

    user.password = password;

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
  const { username, email, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        username,
        picture,
        password: "123456",
        verified: true,
        forgotPassword: uuidv4(),
        tokenConfirm: uuidv4(),
      });

      await user.save();
    }

    if (!user.verified || user.google) {
      return res
        .status(401)
        .json({ ok: false, message: "An error has occurred" });
    }

    const token = await generateJWT(user._id, user.username, "4h");

    return res.status(200).json({
      ok: true,
      id: user._id,
      username: user.username,
      picture: user.picture,
      token,
    });
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
