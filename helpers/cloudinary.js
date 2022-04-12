//TODO cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const savedImg = async (req, img, collection, method) => {
  let tempFilePath;

  if (req) {
    const { tempFilePath: temp_file } = req.file;

    tempFilePath = temp_file;
  }

  try {
    if (method === "PUT" || method === "DELETE") {
      const nameArray = img.split("/");
      const name = nameArray[nameArray.length - 1];
      const [public_id] = name.split(".");
      await cloudinary.uploader.destroy(
        "tree-link/" + collection + "/" + public_id
      );
    }

    if (method === "DELETE") return true;

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
