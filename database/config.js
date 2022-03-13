const { connect } = require("mongoose");

const dbConnection = async () => {
  try {
    await connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Base de datos conectada");
  } catch (error) {
    console.log("No se pudo conectar a la base de datos");
  }
};

module.exports = { dbConnection };
