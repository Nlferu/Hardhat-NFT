const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

async function storeImages(imagesFilePath) {
    // Getting full path to images
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log(`Our Images: ${files}`)
}

module.exports = { storeImages }
