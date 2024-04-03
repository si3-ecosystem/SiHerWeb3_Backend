const express = require("express");
const fs = require("fs")
const ejs = require("ejs")
const { v4: uuidv4 } = require("uuid");

const auth = require("../middlewares/auth.middleware");

const { validateCreateWebpage } = require("../validations/webpage.validations");
const Webpage = require("../models/Webpage.model");
const {
  uploadToFileStorage,
  getFromFileStorage,
  deleteFromFileStorage,
} = require("../utils/fileStorage.utils");
const { registerSubdomain } = require("../utils/namestone.util");

const router = express.Router();

const FLEEK_GATEWAY = process.env.FLEEK_GATEWAY

router.post("/", auth, async (req, res) => {
  const { body, user } = req;
  const error = validateCreateWebpage(body);
  if (error) return res.status(400).send(error);

  const dbWebpage = await Webpage.findOne({ user: user._id });
  if (dbWebpage) return res.status(400).send("Webpage already exists");

  const templateFile = fs.readFileSync(`${__dirname}/../template/index.ejs`)

  const template = ejs.compile(templateFile.toString())
  const renderedTemplate = template(body) 

  const fileBlob = new Blob([renderedTemplate], { type: "text/html" });
  const file = new File([fileBlob], `${uuidv4()}.html`, {
    type: "text/html",
  });
console.log(file);
  const cid = await uploadToFileStorage(file);
console.log(cid);
  const webpage = new Webpage({
    user: user._id,
    cid,
    data: body,
  });
  await webpage.save();

  return res.send({ ...webpage.toJSON() , url: `${FLEEK_GATEWAY}/${webpage.cid}`});
});

router.get("/", auth, async (req, res) => {
  const { user } = req

  const webpage = await Webpage.findOne({ user: user._id })
  console.log(webpage);
  if(!webpage){
    return res.status(404).json({message:"Webpage not found"})
  }
  return res.send({ url: `${FLEEK_GATEWAY}/${webpage?.cid}`, ...webpage?.toJSON() })
})

router.put("/", auth, async (req, res) => {
  const { user, body } = req;

  const error = validateCreateWebpage(body);
  if (error) return res.status(400).send(error);

  const dbWebpage = await Webpage.findOne({ user: user._id });
  if (!dbWebpage) return res.status(404).send("Webpage not found");

  const { cid } = dbWebpage;
  await deleteFromFileStorage(cid);

  const jsonData = JSON.stringify(body);
  const fileBlob = new Blob([jsonData], { type: "application/json" });
  const file = new File([fileBlob], `${uuidv4()}.json`, {
    type: "application/json",
  });

  const newCid = await uploadToFileStorage(file);

  const webpage = await Webpage.findByIdAndUpdate(dbWebpage._id, {
    cid: newCid,
  });
  await webpage.save();

  if(webpage.subdomain){
    await registerSubdomain(webpage.subdomain)
  }

  return res.send({ webpage });
});

router.delete("/", auth, async (req, res) => {
  const { user } = req;

  const webpage = await Webpage.findOne({ user: user._id });
  if (!webpage) return res.status(404).send("Webpage not found");

  const { cid } = webpage;
  await deleteFromFileStorage(cid);

  await Webpage.findByIdAndDelete(webpage._id);

  return res.send({ webpage });
});

module.exports = router;
