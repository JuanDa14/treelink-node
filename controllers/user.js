const { response } = require("express");
const bcrypt = require("bcrypt");

//TODO: Helpers
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/verify-token-google");
/********************/

//TODO: Modelos
const User = require("../models/user");
const { transporterEmailer } = require("../helpers/emailer");
/*******************/

//TODO: Controladores
const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //comparar la contraseña
    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    //Generar JWT
    const token = await generateJWT(user._id, user.username);

    res.json({ ok: true, token, name: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
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
    const token = await generateJWT(user._id, user.username);

    res
      .status(200)
      .json({ ok: true, token, name: user.username, uid: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, msg: "Hable con el administrador", error });
  }
};

const getUserRefresh = (req, res) => {
  const uid = req.uid;
  const username = req.username;

  try {
    res.status(200).json({ ok: true, uid, username });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const loginGoogle = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const { name, email } = await googleVerify(tokenId);

    let user = await User.findOne({ email });

    // TODO: el no usuario existe
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

    //TODO: el usuario existe
    //TODO: Generar token
    const token = await generateJWT(user._id, user.username);

    res
      .status(200)
      .json({ ok: true, token, name: user.username, uid: user._id });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Token invalido" });
  }
};

const forgotPassword = async (req, res = response) => {
  const { email } = req.body;

  try {
    const user = await User.find({ email });
    console.log(user.resetLink);
    user.resetLink = `${process.env.FORGOT_PASSWORD_URL}/resetpassword/${token}`;

    console.log(user.resetLink);

    await user.save();

    //TODO: generando el token de recuperacion de contraseña
    const token = await generateJWT(user._id, user.username);

    //TODO: Enviar email con link
    const transporter = transporterEmailer();

    await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: `${email}`,
      subject: "Hello ✔",
      html: `<a href = ${process.env.FORGOT_PASSWORD_URL}/forgotpassword/${token}>
      ${process.env.FORGOT_PASSWORD_URL}/resetpassword/${token}
      </a>`,
    });

    res.status(200).send({ ok: true, msg: "Revisa tu correo electronico" });
  } catch (error) {
    res.status(400).json({ ok: false, msg: "Token invalido" });
  }
};

module.exports = {
  login,
  register,
  getUserRefresh,
  loginGoogle,
  forgotPassword,
};
