//TODO cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const savedImg = async (req, img, collection) => {
  try {
    const { tempFilePath } = req.file;

    if (img !== "") {
      const nameArray = img.split("/");
      const name = nameArray[nameArray.length - 1];
      const [public_id] = name.split(".");
      await cloudinary.uploader.destroy(
        "tree-link/" + collection + "/" + public_id
      );
    }

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
      folder: "tree-link/" + collection,
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
