const nodemailer = require("nodemailer");

const transporterEmailer = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jgamesterror@gmail.com",
      pass: "moralitos159",
    },
  });
  return transporter;
};

module.exports = { transporterEmailer };
