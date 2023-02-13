const imagesLocation = "./images/randomNft/"

async function handleTokenUris() {
    // // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
    // // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
    // // You could also look at pinata https://www.pinata.cloud/
    // tokenUris = []
    // const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    // for (imageUploadResponseIndex in imageUploadResponses) {
    //     let tokenUriMetadata = { ...metadataTemplate }
    //     tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
    //     tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
    //     tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
    //     console.log(`Uploading ${tokenUriMetadata.name}...`)
    //     const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
    //     tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    // }
    // console.log("Token URIs uploaded! They are:")
    // console.log(tokenUris)
    // return tokenUris
    console.log("mia hasu from handleTokenUris")
}

module.exports = { imagesLocation, handleTokenUris }
