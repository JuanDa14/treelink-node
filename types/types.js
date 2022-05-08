const types = {
  secretToken: process.env.SECRET_TOKEN,
  baseUrl: process.env.BASE_URL,
  forgotPassword: process.env.FORGOT_PASSWORD,
  verifiedEmail: process.env.VERIFIED_EMAIL,
  googleIdClient: process.env.GOOGLE_ID_CLIENT,
  sengridApiKey: process.env.SENDGRID_API_KEY,
  defaultEmail: process.env.DEFAULT_EMAIL,
};

module.exports = { types };
