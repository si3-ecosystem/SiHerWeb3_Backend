const express = require("express")
const auth = require("../middlewares/auth.middleware")
const {
  validateRegisterSubdomainSchema,
} = require("../validations/subdomain.validations")
const Webpage = require("../models/Webpage.model")
const { registerSubdomain } = require("../utils/namestone.util")

const DOMAIN_BLACK_LIST = process.env.DOMAIN_BLACK_LIST
const blackListedDomains = DOMAIN_BLACK_LIST?.split(',')

const router = express.Router()

router.post("/", auth, async (req, res) => {
  const { body, user } = req
console.log(body);
  const error = validateRegisterSubdomainSchema(body)
  if (error) return res.send(error)

  const domain = blackListedDomains.find(domain => domain === body.subdomain)
  if(domain) return res.status(400).send("Subdomain is blacklisted")

  const subdomainRegistered = await Webpage.findOne({
    subdomain: body.subdomain,
  })
  if (subdomainRegistered?.subdomain === body.subdomain)
    return res.status(400).send("Subdomain Already registered")

  let webpage = await Webpage.findOne({ user: user._id })
  if (!webpage) return res.status(404).send("Webpage not found")

  const isSubdomainRegistered = await registerSubdomain(
    body.subdomain,
    webpage.cid
  )
  if (!isSubdomainRegistered)
    return res.status(400).send("Could not register subdomain")

  webpage = await Webpage.findOneAndUpdate(
    { user: user._id },
    { subdomain: body.subdomain },
    { new: true }
  )

  return res.status(200).send({ webpage })
})

module.exports = router
