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

  const html =
    template === "forgot-password"
      ? templateForgotPassword(username, link)
      : templateValidateEmail(username, link);

  await transport.sendMail({
    from: types.defaultEmail,
    to: `${email}`,
    subject,
    html,
  });
};

module.exports = { sendEmail };
