// We can name all parameters as we want!
const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    hauka: "",
    attributes: [
        {
            trait_type: "Devilness",
            value: 666,
        },
        {
            trait_type: "Hauker",
            value: 777,
        },
    ],
    date: new Date(),
}

module.exports = { metadataTemplate }
