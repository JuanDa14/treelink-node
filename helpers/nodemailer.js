const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const { types } = require("../types/types");

const { templateForgotPassword } = require("../templates/forgot-password");
const { templateValidateEmail } = require("../templates/validate-email");

const transporter = () => {
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: types.sengridApiKey,
    })
  );
  return transport;
};

const sendEmail = async (template, username, link, email, subject) => {
  const transport = transporter();

  const html = () => {
    switch (template) {
      case "forgot-password":
        return templateForgotPassword(username, link);

      case "validate-email":
        return templateValidateEmail(username, link);

      default:
        "No template";
    }
  };

  await transport.sendMail({
    from: types.defaultEmail,
    to: `${email}`,
    subject,
    html: html(),
  });
};

module.exports = { sendEmail };
