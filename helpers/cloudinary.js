//TODO cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

const savedImg = async (req, img, collection) => {
  try {
    const { tempFilePath, mimetype } = req.file;

    const extension = mimetype.split("/")[1];

    if (!allowedExtensions.includes(extension)) {
      return false;
    }

    if (img !== "") {
      const nameArray = img.split("/");
      const name = nameArray[nameArray.length - 1];
      const [public_id] = name.split(".");
      await cloudinary.uploader.destroy(collection + "/" + public_id);
    }

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
      folder: collection,
    });

    if (secure_url) {
      return secure_url;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { savedImg };
