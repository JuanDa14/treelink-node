const { OAuth2Client } = require("google-auth-library");
const { types } = require("../types/types");

const client = new OAuth2Client(types.googleIdClient);

const googleVerify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: types.googleIdClient,
  });

  const { name, picture, email } = ticket.getPayload();

  return { name, picture, email };
};

const verifyTokenGoogle = async (req, res, next) => {
  const token_google = req.header("Authorization").split(" ")[1];

  if (!token_google)
    return res.status(400).json({ ok: false, message: "Token not sent" });

  try {
    const { name, picture, email } = await googleVerify(token_google);

    if (!(name && picture && email))
      return res
        .status(401)
        .json({ ok: false, message: "An error has occurred" });

    req.username = name;
    req.email = email;
    req.picture = picture;

    next();
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, message: "Interval server error" });
  }
};

module.exports = { verifyTokenGoogle };
