const { FleekSdk, PersonalAccessTokenService } = require("@fleekxyz/sdk")

const FLEEK_PAT = process.env.FLEEK_PAT
const FLEEK_PROJECT_ID = process.env.FLEEK_PROJECT_ID
const FLEEK_GATEWAY = process.env.FLEEK_GATEWAY

const newAccessTokenService = new PersonalAccessTokenService({
  personalAccessToken: FLEEK_PAT,
  projectId: FLEEK_PROJECT_ID,
})

const fleekSdk = new FleekSdk({ accessTokenService: newAccessTokenService })

const uploadToFileStorage = async (file) => {
  try {
    const response = await fleekSdk.ipfs().add({path: file.name,content:file})
    return response.cid
  } catch (ex) {
    console.log(ex)
    return null
  }
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
  deleteFromFileStorage,
}
