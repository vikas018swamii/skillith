const sharp = require("sharp");
const path = require("path");

const processImage = async (file) => {
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `photo-${uniqueSuffix}${path.extname(file.originalname)}`;
    const outputPath = path.join("uploads", filename);
    await sharp(file.buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return filename;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

module.exports = { processImage };
