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

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body, user } = req;
  console.log(body);
  console.log(user);
  const error = validateCreateWebpage(body);
  if (error) return res.status(400).send(error);

  const dbWebpage = await Webpage.findOne({ user: user._id });
  if (dbWebpage) return res.status(400).send("Webpage already exists");

  const jsonData = JSON.stringify(body);
  const fileBlob = new Blob([jsonData], { type: "application/json" });
  const file = new File([fileBlob], `${uuidv4()}.json`, {
    type: "application/json",
  });

  const cid = await uploadToFileStorage(file);

  const webpage = new Webpage({
    user: user._id,
    cid,
    subdomain: uuidv4(),
  });
  await webpage.save();

  return res.send({ webpage });
});

router.get("/", async (req, res) => {
  const templateFile = fs.readFileSync(`${__dirname}/../template/index.ejs`)

  const template = ejs.compile(templateFile.toString())
  const renderedTemplate = template({
    "navbar": {
        "logo": "/eye_logo.png",
        "imageAltText": "logo",
        "websiteName": "SI HER",
        "links": [
            "VALUE",
            "MY MEDIA",
            "VISION",
            "CV",
            "CONNECT"
        ],
        "buttonText": "LOGIN",
        "fixedHeader": true
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
                "title": "Region",
                "text": "Latin America"
            },
            {
                "title": "Web3 Category",
                "text": "Web3 Founder"
            },
            {
                "title": "Organization Affiliations",
                "text": "Web3 Founder"
            },
            {
                "title": "Community Affiliations",
                "text": "Si Her, WeDAO Latam, EcstaSHE, CryptoFemale, Web3 Ladies"
            }
        ],
        "userimg": "https://salmon-capable-bee-381.mypinata.cloud/ipfs/QmWj5ZD8uHFXCMkhWcRZsZsEMyC28wuLXuZU5BUVEVRKqj",
        "name": "Kara Howard",
        "pronoun": "SHE/HER",
        "marquee": [
            "Self-Realization",
            "Emerging Market Opportunities",
            "DECENTRALIZING CURRENCIES & TECHNOLOGIES",
            "COLLABORATIVE WEB3-4 ECOSYSTEM GROWTH",
            "Inclusive Platforms"
        ]
    },
    "value": {
        "title": "MY, VALUE",
        "description": "My, career began as an Equity Research analyst on Wall St. I started the MBA program at NYU in the Fall of 2008, right as the market crashed, with Occupy Wall St. protests happening outside our campus doors. As often happens, times of crises create opportunity and I shifted my career focus from finance to marketing & entrepreneurship. I began my entrepreneurial journey with ups and downs and great learning - most importantly, discovering my passion and purpose in supporting women in elevating their voices and professional and personal success. I have led and participated in women-related communities in investing, startups, technology, AI, futurism, product and data science. I have placed over 350 women in speaking opportunities and experience shared value and fulfillment when I see women stepping into their full potential. I bring the value of ten years in finance, and ten years of community architecting & growth marketing, to Si Her as it`s platform creator. And my exploration in Equity Research continues.",
        "TVName": "SI HER TV",
        "video": "https://lvpr.tv?v=33e86xt51h1f718x",
        "links": [
            {
                "title": "WE ARE SI3",
                "link": "https://www.si-her.live/"
            },
            {
                "title": "UNLOCKING NFT'S FOR META IMPACT",
                "link": "https://www.youtube.com/watch?v=y-Bz60q298c"
            },
            {
                "title": "DIVERSITY IN THE NEW ECONOMY",
                "link": "https://podcasters.spotify.com/pod/show/b-r-i/episodes/Diversity-in-the-new-economy-e26pn30/a-aa40rlt"
            }
        ],
        "buttonText": "Support Kara in cryto"
    },
    "vision": {
        "title": "Rizwan's Value",
        "description": "Rizwan is a envision a near-term future that is operating with values based on inclusion, equity, and decentralized decision-making. I am hopeful to support in creating platforms that streamline cooperation and accelerate our human potential."
    },
    "CV": {
        "title": "CV Highlights",
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
    "available": {
        "title": "I’M AVAILABLE FOR",
        "marque": [
            {
                "heading": "speaking",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "Advising",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "Collabs",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "speaking",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "Advising",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "Collabs",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "speaking",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "Advising",
                "image": "https://something.com/eye_logo.png"
            },
            {
                "heading": "Collabs",
                "image": "https://something.com/eye_logo.png"
            }
        ],
        "description": "You are viewing an ENS domain, which is a distributed and open naming system based on the Ethereum blockchain. This website is hosted with Pinata on the IPFS, or InterPlanetary File System, which is a peer-to-peer file sharing network. The limo domain extension is a privacy-preserving ENS gateway for resolving/accessing ENS records/domains & IPFS/internet 3.0 content. For a complete web3 experience, we recommend viewing this site with a Metamask extension or Brave browser.",
        "linkedin": {
            "url": "https://www.linkedin.com/in/decentralizing/",
            "hide": false
        },
        "hey": {
            "url": "https://www.linkedin.com/in/decentralizing/",
            "hide": false
        },
        "email": {
            "address": "kara@si3.space",
            "hide": false
        }
    }
})
  return res.send(renderedTemplate)
});

router.get("/:subdomain", async (req, res) => {
  const { subdomain } = req.params;
  const webpage = await Webpage.findOne({ subdomain });
  if (!webpage) return res.status(404).send("Webpage not found");

  const { cid } = webpage;
  const webpageJson = await getFromFileStorage(cid);

  return res.send({ webpage: webpageJson });
});

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
