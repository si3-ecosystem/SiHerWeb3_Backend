const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fileUpload = require("express-fileupload");
const Image = require("../models/Image.model");
const {
  uploadToFileStorage,
  deleteFromFileStorage,
} = require("../utils/fileStorage.utils");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

const FLEEK_GATEWAY = process.env.FLEEK_GATEWAY

router.post("/", auth, fileUpload(), async (req, res) => {
  const { files, user } = req;
  if (!files?.image) return res.status(400).send("Image is required");

  const file = new File([files.image.data], `${uuidv4()}.${files.image.name}`);
  const imageCid = await uploadToFileStorage(file);

  if(!imageCid) return res.status(400).send("Could not upload Image")

  const image = new Image({ user: user._id, cid: imageCid });
  await image.save();

  const imageUrl = `${FLEEK_GATEWAY}/${imageCid}`;
  return res.send({ image: { ...image.toJSON(), imageUrl } });
});

router.get("/", auth, async (req, res) => {
  const { user } = req;
  const { pageNumber, pageSize } = req.query;

  const imagesDocs = await Image.find({ user: user._id })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  const images = imagesDocs.map((image) => ({
    ...image.toJSON(),
    imageUrl: `${FLEEK_GATEWAY}/${image.cid}`,
  }));
  return res.send({ images });
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const image = await Image.findById(id);
  if (!image) return res.status(404).send("Image not found");

  const imageUrl = `${FLEEK_GATEWAY}/${image.cid}`;
  return res.send({ image: { ...image.toJSON(), imageUrl } });
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const image = await Image.findByIdAndDelete(id);
  if (!image) return res.status(404).send("Image not found");

  await deleteFromFileStorage(image.cid);
  return res.send({ image: image.toJSON() });
});

module.exports = router;
