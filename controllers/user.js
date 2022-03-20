const { response } = require("express");
const bcrypt = require("bcrypt");
const { templateEmail } = require("../templates/email");

//TODO: Helpers
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/verify-token-google");
/********************/

//TODO: Modelos
const User = require("../models/user");
const { transporter } = require("../helpers/nodemailer");
/*******************/

//TODO: Controladores
const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //comparar la contraseña
    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({ ok: false, msg: "Incorrect password" });
    }

    //Generar JWT
    const token = await generateJWT(user._id, user.username, true);

    res.json({ ok: true, token, name: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const register = async (req, res = response) => {
  const { email, password, username } = req.body;
  try {
    const user = new User({ username, email, password });

    //Encriptando contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Guardando el nuevo usuario
    await user.save();

    //Creando el token
    const token = await generateJWT(user._id, user.username, true);

    res
      .status(200)
      .json({ ok: true, token, name: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const getUserRefresh = (req, res) => {
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
        password: "google",
        google: true,
      };

      user = new User(data);

      await user.save();
    }

    //El usuario existe - Generar token
    const token = await generateJWT(user._id, user.username, true);

    res
      .status(200)
      .json({ ok: true, token, name: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

//TODO: Restablecer contraseña
const forgotPassword = async (req, res = response) => {
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
      return res.status(403).json({ ok: false, msg: "Password change error" });
    }

    //Generando el token de recuperacion de contraseña

    const token = await generateJWT(user._id, user.username, false);

    //Actualizando el usuario
    const link = `${process.env.FORGOT_PASSWORD_URL}/auth/resetpassword?q=${token}`;
    user.resetLink = link;

    await user.save();

    //Enviar email con link
    const transport = transporter();

    const html = templateEmail(user.username, link); //template

    await transport.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: `${email}`,
      subject: "Forgot Password",
      html,
    });

    res.status(200).send({ ok: true, msg: "Check your email!!!" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Talk to the administrator" });
  }
};

const resetPassword = async (req, res) => {
  const { password, resetLink } = req.body;

  const uid = req.uid;

  try {
    const user = await User.findOne({ _id: uid });

    //Verificando los links
    if (user.resetLink !== process.env.FORGOT_PASSWORD_URL + resetLink) {
      return res.status(401).json({
        ok: true,
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
};
