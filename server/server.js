const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

const whiteList = ["http://localhost:3000", "https://treelink.netlify.app"];

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
    //TODO Cors
    this.app.use(cors({ origin: whiteList }));
    //TODO Parseo
    this.app.use(express.json());
    //TODO File Upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use("/api/link", require("../routes/link.routes"));
    this.app.use("/api/user", require("../routes/user.routes"));
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Corriendo en el puerto ${process.env.PORT}`);
    });
  }
}

module.exports = { Server };
