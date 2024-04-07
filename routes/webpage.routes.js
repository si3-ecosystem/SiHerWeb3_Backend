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

// router.get("/", auth, async (req, res) => {
router.get("/", async (req, res) => {
  // const { user } = req

  // const webpage = await Webpage.findOne({ user: user._id })
  // console.log(webpage);

  const body = {
    "navbar": {
        "websiteName": "Rizwan Amjad",
        "links": [
            "VALUE",
            "MY MEDIA",
            "VISION",
            "CV",
            "CONNECT with Rizwan"
        ]
    },
    "landing": {
        "title": "I’M KARA,",
        "subTitle": "& I CREATE EQUITABLE PLATFORMS FOR THE NEW ECONOMY.",
        "hashTagTitle": "WHAT I STAND FOR:",
        "hashTags": [
            "COLLABORATION",
            "EQUITY",
            "IMPACT",
            "DECENTRALIZATION",
            "EDUCATION"
        ],
        "categories": [
            {
                "title": "Region"
            },
            {
                "title": "Web3 Category"
            },
            {
                "title": "Organization Affiliations"
            },
            {
                "title": "Community Affiliations"
            }
        ],
        "userimg": {
            "path": "https://cf-ipfs.com/ipfs/QmZkhhvn9drSrzLMG5pUMcq6XmoGFKNWPQHxoR9kYju1Zs"
        },
        "name": "Kara Howard",
        "pronoun": "SHE/HER"
    },
    "value": {
        "title": "MY VALUE",
        "description": "My career began as an Equity Research analyst on Wall St. I started the MBA program at NYU in the Fall of 2008, right as the market crashed, with Occupy Wall St. protests happening outside our campus doors. As often happens, times of crises create opportunity and I shifted my career focus from finance to marketing & entrepreneurship. I began my entrepreneurial journey with ups and downs and great learning - most importantly, discovering my passion and purpose in supporting women in elevating their voices and professional and personal success. I have led and participated in women-related communities in investing, startups, technology, AI, futurism, product and data science. I have placed over 350 women in speaking opportunities and experience shared value and fulfillment when I see women stepping into their full potential. I bring the value of ten years in finance, and ten years of community architecting & growth marketing, to Si Her as it`s platform creator. And my exploration in Equity Research continues.",
        "TVName": "SI HER TV",
        "video": {
            "path": "https://cf-ipfs.com/ipfs/QmNc6sGcLwEyugQwcRm9LVAnf7srTggJbFfxBB32HzDU7d"
        },
        "links": [
            {
                "title": "WE ARE SI3"
            },
            {
                "title": "UNLOCKING NFT'S FOR META IMPACT"
            },
            {
                "title": "DIVERSITY IN THE NEW ECONOMY"
            }
        ],
        "buttonText": "Support Kara in cryto"
    },
    "vision": {
        "title": "Diversity in the New Economy",
        "description": "I envision a near-term future that is operating with values based on inclusion, equity, and decentralized decision-making. I am hopeful to support in creating platforms that streamline cooperation and accelerate our human potential."
    },
    "CV": {
        "present": {
            "title": "Present",
            "highlights": [
                {
                    "year": "2002-10",
                    "text": "EQUITY RESEARCH ASSOCIATE / FINANCIAL ANALYST"
                },
                {
                    "year": "2004",
                    "text": "BSC FROM UW-MADISON - PERSONAL FINANCE"
                },
                {
                    "year": "2012",
                    "text": "MBA FROM NYU STERN - MARKETING & ENTREPRENEURSHIP"
                },
                {
                    "year": "2015-19",
                    "text": "VP OF GROWTH & PARTNERSHIPS AT CLEVERTAP"
                },
                {
                    "year": "2017-21",
                    "text": "MANAGED THE FEMININE INTELLIGENCE"
                },
                {
                    "year": "2022",
                    "text": "PERSONAL DEVELOPMENT RETREAT"
                },
                {
                    "year": "2023",
                    "text": "INITIATED SI3 & SI HER TALENT COLLECTIVE"
                }
            ]
        },
        "past": {
            "title": "Past",
            "highlights": [
                "WeAreSi3",
                "Unlocking NFT´s for Meta Impact",
                "Diversity in the New Economy"
            ]
        },
        "future": {
            "title": "Future",
            "text": "I envision a near-term future that is operating with values based on inclusion, equity, and decentralized decision-making. I am hopeful to support in creating platforms that streamline cooperation and accelerate our human potential."
        }
    },
    "available": {
        "title": "I’M AVAILABLE FOR",
        "marque": [
            {
                "heading": "speaking"
            },
            {
                "heading": "Advising"
            },
            {
                "heading": "Collabs"
            }
        ],
        "linkedin": {
            "url": "@Si Her TV",
            "hide": false
        },
        "instagram": {
            "url": "@Si Her TV",
            "hide": false
        },
        "twitter": {
            "url": "@Si Her TV",
            "hide": false
        },
        "email": {
            "address": "kara@si3.space",
            "hide": false
        }
    }
}

  const templateFile = fs.readFileSync(`${__dirname}/../template/index.ejs`)

  const template = ejs.compile(templateFile.toString())
  const renderedTemplate = template(body) 

  return res.send(renderedTemplate)
  // if(!webpage){
  //   return res.status(404).json({message:"Webpage not found"})
  // }
  // return res.send({ url: `${FLEEK_GATEWAY}/${webpage?.cid}`, ...webpage?.toJSON() })
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
