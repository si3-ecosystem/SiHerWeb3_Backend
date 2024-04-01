const express = require("express")
const auth = require("../middlewares/auth.middleware")
const {
  validateRegisterSubdomainSchema,
} = require("../validations/subdomain.validations")
const Webpage = require("../models/Webpage.model")
const { registerSubdomain } = require("../utils/namestone.util")

const router = express.Router()

router.post("/", auth, async (req, res) => {
  const { body, user } = req

  const error = validateRegisterSubdomainSchema(body)
  if (error) return res.send(error)

  const subdomainRegistered = await Webpage.countDocuments({
    subdomain: body.subdomain,
  })
  if (subdomainRegistered)
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

  return res.send({ webpage })
})

module.exports = router
