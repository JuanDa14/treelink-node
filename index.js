require("dotenv").config();

const { Server } = require("./server/server");

const app = new Server();

app.listen();
