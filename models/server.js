const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();

    //Base de datos
    this.Connection();

    //Middleware
    this.middleware();

    //Rutas
    this.routes();
  }

  async Connection() {
    await dbConnection();
  }

  middleware() {
    //Cors
    this.app.use(cors());
    //Parseo
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/api/v1/todo", require("../routes/todo"));
    this.app.use("/api/v1", require("../routes/user"));
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Corriendo en el puerto ${process.env.PORT}`);
    });
  }
}

module.exports = { Server };
