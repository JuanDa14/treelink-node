const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

const validateFile = (req, res, next) => {
  const { mimetype } = req.files.file;

  const extension = mimetype.split("/")[1];

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({
      ok: false,
      message: "No file uploaded",
    });
  }

  if (!allowedExtensions.includes(extension)) {
    return res
      .status(400)
      .json({ ok: false, message: "Extension not allowed" });
  }

  next();
};

module.exports = { validateFile };
