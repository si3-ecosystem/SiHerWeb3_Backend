const { PINATA_URL } = require("../consts")
const PINATA_AUTH_TOKEN = process.env.PINATA_AUTH_TOKEN

const uploadJsonToFileStorage = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(PINATA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_AUTH_TOKEN}`,
    },
    body: formData,
  })

  const responseJson = await response.json()
  return responseJson.IpfsHash
}

module.exports = { uploadJsonToFileStorage }
