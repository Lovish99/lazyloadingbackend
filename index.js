const express = require("express");
//import { importImagesUrls } from "./utils/images";
const path = require("path");

const fs = require("fs/promises");
const { encode } = require("blurhash");
const sharp = require("sharp");
const cors = require("cors");

const app = express();

const IMAGES_DIR_PATH = path.join(__dirname, "images");

app.use(cors());
//app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => res.send("Hello Server!"));

app.get("/images", async (req, res) => {
  console.log("444");
  const a = await encodeAllImages();
  console.log("9999");
  console.log(a);
  console.log("9999");
  // const a = require("./db.json");
  res.send(a);
});

const encodeImageToBlurhash = (path) =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });

async function encodeAllImages() {
  console.log("55");
  const imagesNames = await fs.readdir(IMAGES_DIR_PATH);

  const data = [];

  for (const name of imagesNames) {
    const encodedHash = await encodeImageToBlurhash(
      path.join(__dirname, "images", name)
    );
    data.push({ name, blurhash: encodedHash });
    console.log("Hash: ", encodedHash);
  }
  console.log(data);
  return data;
}

app.listen(9000, () => {
  console.log("Server listening on PORT", 9000);
});
