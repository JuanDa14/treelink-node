const Link = require("../models/link");

const { savedImg } = require("../helpers/cloudinary");

const getLinks = async (req, res) => {
  const { id } = req.user;
  try {
    const links = await Link.find({ user: id });

    return res.status(200).json({ ok: true, links });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error,
    });
  }
};

const postLink = async (req, res) => {
  const { title, url, img } = req.body;
  const { id, username } = req.user;
  try {
    // const secure_url = await savedImg(req.files, "", username);

    const newlink = await new Link({
      title,
      url,
      img,
      user: id,
    });

    await newlink.save();

    const { createdAt, updatedAt, ...link } = newlink._doc;

    return res.status(201).json({ ok: true, link });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error,
    });
  }
};

const updateLink = async (req, res) => {
  const { id } = req.params;
  const { title, url, img } = req.body;
  const { username } = req.user;
  try {
    // const link = await Link.findById(id).populate("user", "username");

    const link = await Link.findByIdAndUpdate(
      id,
      { title, url, img },
      { new: true }
    );
    // let secure_url;

    // if (!req.files) {
    //   secure_url = link.img;
    // } else {
    //   secure_url = await savedImg(req.files, link.img, username);
    // }

    // if (!secure_url) {
    //   return res
    //     .status(401)
    //     .json({ ok: false, message: "Error uploading image" });
    // }

    // link.title = title;
    // link.url = url;
    // link.img = secure_url;

    // await link.save();

    return res.status(200).json({ ok: true, link });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error,
    });
  }
};

const deleteLink = async (req, res) => {
  const { id } = req.params;
  try {
    await Link.findByIdAndDelete(id);

    return res.status(200).json({ ok: true, message: "Link deleted" });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { postLink, getLinks, updateLink, deleteLink };
