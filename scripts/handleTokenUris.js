const { metadataTemplate } = require("../utils/metadataTemplate")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNft/"

async function handleTokenUris() {
    // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
    // To the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
    // You could also look at pinata https://www.pinata.cloud/

    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)

    for (imageUploadResponseIndex in imageUploadResponses) {
        // Create metadata
        // Upload metadata
        // Below "...metadataTemplate" in JS is called spread syntax and it allows to create a new object by copying the properties of an existing object into a new one.
        // So we are just sticking data from "metadataTemplate" into "tokenUriMetadata" variable.
        let tokenUriMetadata = { ...metadataTemplate }
        // Replacing ".png" with nothing ""
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name} metadata...`)
        // Store the JSON to pinata/IPFS
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)

    return tokenUris
}

module.exports = { imagesLocation, handleTokenUris }
