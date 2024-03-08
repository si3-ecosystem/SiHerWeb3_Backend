const { PINATA_URL, PINATA_GATEWAY } = require("../consts")
const PINATA_AUTH_TOKEN = process.env.PINATA_AUTH_TOKEN

const uploadToFileStorage = async (file) => {
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

const getFromFileStorage = async (cid) => {
  const res = await fetch(`${PINATA_GATEWAY}/${cid}`)
  const json = await res.json()
  return json
}

const deleteFromFileStorage = async (cid) => {
  await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${PINATA_AUTH_TOKEN}`,
    },
  })
}

module.exports = {
  uploadToFileStorage,
  getFromFileStorage,
  deleteFromFileStorage,
}
