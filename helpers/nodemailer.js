const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const { templateForgotPassword } = require("../templates/forgot-password");
const { templateValidateEmail } = require("../templates/validate-email");

const transporter = () => {
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    })
  );
  return transport;
};

const sendEmail = async (template, username, link, email, subject) => {
  const transport = transporter();

  const html =
    template === "forgot-password"
      ? templateForgotPassword(username, link)
      : templateValidateEmail(username, link); //template

  await transport.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: `${email}`,
    subject,
    html,
  });
};

module.exports = { sendEmail };
