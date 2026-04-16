////  Cloud storage provider is not fixed it can change with the time

const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer) {
  // console.log(buffer);
  const result = await imagekit.files.upload({
    file: buffer.toString("base64"), //// imp line
    fileName: "image.jpg",
  });

  return result;
}

module.exports = uploadFile;
