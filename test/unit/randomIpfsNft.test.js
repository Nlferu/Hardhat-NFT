const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          let randomNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomnft"])
              randomNft = await ethers.getContract("RandomIpfsNft")
          })
          describe("Constructor", () => {
              it("Initializes the NFT Correctly.", async () => {
                  const randomNftName = await randomNft.name()
                  const randomNftSymbol = await randomNft.symbol()
                  const randomNftCounter = await randomNft.getTokenCounter()
                  assert.equal(randomNftName, "Random IPFS NFT")
                  assert.equal(randomNftSymbol, "RIN")
                  assert.equal(randomNftCounter.toString(), "0")
              })
          })
      })
