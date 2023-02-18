// Fix in progres...

const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

// We have to downgrade "@pinata/sdk": "^2.1.0" into "@pinata/sdk@^1.1.23" otherwise code won't work!
async function storeImages(imagesFilePath) {
    // Getting full path to images
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log(`Our Images:`)
    console.log(files)

    let responses = []
    console.log("----------------------------------------------------")
    console.log("Uploading To Pinata...")
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            console.log(`Uploading File ${fileIndex}...`)
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
            console.log(`File ${fileIndex} Uploaded Successfully!`)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (err) {
        console.log(err)
    }
    return null
}

// We have to downgrade "@pinata/sdk": "^2.1.0" into "@pinata/sdk@^1.1.23" otherwise code won't work!
// async function storeImages(imagesFilePath) {
//     const fullImagesPath = path.resolve(imagesFilePath)

//     // Filter the files in case there is a file that is not a .png
//     // Parameter "file" -> is a parameter that represents one of the file names returned by readdirSync().
//     const files = fs.readdirSync(fullImagesPath).filter((file) => file.includes(".png"))

//     /* Same Function without "=>"
//         const files = fs.readdirSync(fullImagesPath).filter(function (file) {
//             return file.includes(".png")
//         })
//     */

//     console.log(`Our Images:`)
//     console.log(files)

//     let responses = []
//     console.log("Uploading to IPFS...")

//     for (const fileIndex in files) {
//         const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
//         const options = {
//             pinataMetadata: {
//                 name: files[fileIndex],
//             },
//         }
//         try {
//             console.log(`Working On ${fileIndex}...`)
//             await pinata
//                 .pinFileToIPFS(readableStreamForFile, options)
//                 .then((result) => {
//                     responses.push(result)
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                 })
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     return { responses, files }
// }

module.exports = { storeImages, storeTokenUriMetadata }
