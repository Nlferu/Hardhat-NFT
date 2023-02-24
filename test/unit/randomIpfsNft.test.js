const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          beforeEach(async () => {})
          describe("Constructor", () => {
              it("Initializes the NFT Correctly.", async () => {
                  // Check name, token and tokencounter
              })
          })
      })
