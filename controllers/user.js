const { response } = require("express");
const bcrypt = require("bcrypt");

//Helpers
const { generateJWT } = require("../helpers/generate-jwt");

//Modelos
const User = require("../models/user");
const { verifyToken } = require("../helpers/verify-token");

//Controladores
const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //Verificando que el usuario exista
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, msg: "El email no esta registrado" });
    }

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
    user.save();

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

const verifyJWT = (req, res) => {
  const token = req.header("x-token");

  try {
    const verify = verifyToken(token);
    
    res.status(200).json({ ok: true, ...verify });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Hubo un error al verficar token" });
  }
};

module.exports = { login, register, verifyJWT };
