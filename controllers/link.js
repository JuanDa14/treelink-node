const Link = require("../models/link");

const { savedImg } = require("../helpers");

const getUserLinks = async (req, res) => {
  const { id } = req;

  try {
    const links = await Link.find({ user: id });

    return res.status(200).json({ ok: true, links });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

const createUserLink = async (req, res) => {
  const { title, url } = req.body;

  const { id, username } = req;

  try {
    const secure_url = await savedImg(req.files, null, username, "POST");

    if (!secure_url) {
      return res
        .status(401)
        .json({ ok: false, message: "Error uploading image" });
    }

    const link = await new Link({
      title,
      url,
      img: secure_url,
      user: id,
    });

    await link.save();

    return res.status(201).json({ ok: true, link });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

const updateUserLink = async (req, res) => {
  const { id } = req.params;

  const { username } = req;

  const { title, url } = req.body;

  try {
    const link = await Link.findById(id);

    let secure_url;

    if (req.files) {
      secure_url = await savedImg(req.files, link.img, username, "PUT");
      link.img = secure_url;

      if (!secure_url) {
        return res
          .status(401)
          .json({ ok: false, message: "Error uploading image" });
      }
    }

    if (title || url) {
      link.title = title;
      link.url = url;
    }

    await link.save();

    return res.status(200).json({ ok: true, link });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

const deleteUserLink = async (req, res) => {
  const { id } = req.params;

  const { username } = req;

  try {
    const link = await Link.findByIdAndDelete(id);

    const img_deleted = await savedImg(null, link.img, username, "DELETE");

    if (!img_deleted) {
      return res
        .status(401)
        .json({ ok: false, message: "Error deleting image" });
    }

    return res.status(200).json({ ok: true, message: "Deleted user link" });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserLinks,
  createUserLink,
  updateUserLink,
  deleteUserLink,
};
