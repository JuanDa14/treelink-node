const bcrypt = require("bcrypt");

//TODO: Helpers
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/verify-token-google");
const { sendEmail } = require("../helpers/nodemailer");
/********************/

//TODO: Modelos
const User = require("../models/user");
/*******************/

//TODO: Controladores
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //Verificando si el correo esta validado
    if (!user.verifyEmail) {
      return res.status(403).json({ ok: false, msg: "Verify your email" });
    }

    //comparar la contraseña
    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({ ok: false, msg: "Incorrect password" });
    }

    //Generar JWT
    const token = await generateJWT(user._id, user.username, "4h");

    res.json({
      ok: true,
      token,
      username: user.username,
      uid: user._id,
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = new User({ username, email, password });

    //Encriptando contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Creando el token para el link
    const token = await generateJWT(user._id, user.username, "10m");

    //link de confirmacion
    const link = `${process.env.FORGOT_PASSWORD_URL}/auth/verify-email?q=${token}`;

    user.linkVerifyEmail = link;

    //Guardando al usuario
    await user.save();

    //Enviar email con link
    await sendEmail(
      "validate-email",
      user.username,
      link,
      user.email,
      "Validate Email"
    );

    res.status(200).json({ ok: true, msg: "¡ Check your email !" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const verifyEmail = async (req, res) => {
  const uid = req.uid;

  const { linkVerifyEmail } = req.body;

  try {
    const user = await User.findOne({ _id: uid });

    //Verificar que el usuario exista
    if (!user) {
      return res
        .status(500)
        .json({ ok: false, msg: "The email is not registered" });
    }

    //Verificando que los links sean iguales
    if (
      user.linkVerifyEmail !==
      process.env.FORGOT_PASSWORD_URL + linkVerifyEmail
    ) {
      return res
        .status(500)
        .json({ ok: false, msg: "There was an error confirming the email" });
    }

    user.verifyEmail = true;

    await user.save();

    //Genear token para el login automatico
    const token = await generateJWT(user._id, user.username, "4h");

    res.json({ ok: true, token, username: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const getUserRefresh = async (req, res) => {
  const uid = req.uid;
  const username = req.username;

  try {
    res.status(200).json({ ok: true, uid, username });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

//TODO: Login con google
const loginGoogle = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const { name, email } = await googleVerify(tokenId);

    let user = await User.findOne({ email });

    // El no usuario existe
    if (!user) {
      const data = {
        username: name,
        email,
        password: process.env.PASSWORD_LOGIN_GOOGLE,
        google: true,
      };

      user = new User(data);

      //Creando el token para el link
      const token = await generateJWT(user._id, user.username, "10m");

      //link de confirmacion
      const link = `${process.env.FORGOT_PASSWORD_URL}/auth/verify-email?q=${token}`;

      user.linkVerifyEmail = link;

      //Guardando al usuario
      await user.save();

      //Enviar email con link
      await sendEmail(
        "validate-email",
        user.username,
        link,
        user.email,
        "Validate Email"
      );

      return res.status(200).json({ ok: true, msg: "¡ Check your email !" });
    }

    //Verificando si el correo esta validado
    if (!user.verifyEmail) {
      return res.status(403).json({ ok: false, msg: "Verify your email" });
    }

    //El usuario existe - Generar token
    const token = await generateJWT(user._id, user.username, "4h");

    res
      .status(200)
      .json({ ok: true, token, username: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

//TODO: Restablecer contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(500)
        .json({ ok: false, msg: "The email is not registered" });
    }

    //Verificando si es login con google
    if (user.google) {
      return res
        .status(403)
        .json({ ok: false, msg: "Error when trying to reset the password" });
    }

    //Verificando si el correo esta validado
    if (!user.verifyEmail) {
      return res.status(403).json({ ok: false, msg: "Verify your email" });
    }

    //Generando el token de recuperacion de contraseña

    const token = await generateJWT(user._id, user.username, "10m");

    const link = `${process.env.FORGOT_PASSWORD_URL}/auth/resetpassword?q=${token}`;

    //Actualizando el usuario
    user.resetLink = link;
    await user.save();

    //Enviar email con link
    await sendEmail(
      "forgot-password",
      user.username,
      link,
      user.email,
      "Recover Password"
    );

    res.status(200).json({ ok: true, msg: "¡ Check your email !" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const resetPassword = async (req, res) => {
  const { password, resetLink } = req.body;

  const uid = req.uid;

  try {
    const user = await User.findOne({ _id: uid });

    //Verificando que no actualize dos 2 veces la contraseña con el mismo token
    if (user.resetLink === "") {
      return res.status(401).json({
        ok: false,
        msg: "Invalid link",
      });
    }

    //Verificando los links
    if (user.resetLink !== process.env.FORGOT_PASSWORD_URL + resetLink) {
      return res.status(401).json({
        ok: false,
        msg: "An error has occurred when wanting to change the Password",
      });
    }

    //Encriptando la nueva contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Guardando el usuario
    user.resetLink = "";
    await user.save();

    res.status(200).json({ ok: true, msg: "Updated password" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

module.exports = {
  login,
  register,
  getUserRefresh,
  loginGoogle,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
