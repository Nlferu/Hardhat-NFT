const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { handleTokenUris } = require("../scripts/handleTokenUris")
const { developmentChains, networkConfig, FUND_AMOUNT } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Mock, vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit, dogTokenUris, mintFee

    log("----------------------------------------------------")
    log(`Deploying RandomIpfsNft...`)
    log("Creating VRFV2 Subscription...")
    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        const subscriptionOwner = transactionReceipt.events[0].args.owner
        log(`Subscription Id: ${subscriptionId}`)
        log(`Subscription Owner: ${subscriptionOwner}`)
        log(`Funding Subscription...`)
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
        log(`Subscription Funded!`)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    // Getting the IPFS hashes of our images

    // 1. With our own IPFS node: https://docs.ipfs.io/
    // 2. Pinata: https://www.pinata.cloud/
    // 3. NFT.Storage: https://nft.storage/

    console.log(`Upload To Pinata: ${process.env.UPLOAD_TO_PINATA}`)
    if (process.env.UPLOAD_TO_PINATA === "true") {
        dogTokenUris = await handleTokenUris()
    }

    // dogTokenUris = [
    //     "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    //     "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    //     "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
    // ]

    // Getting Details From `helper-hardhat-config.js`:
    gasLane = networkConfig[chainId].gasLane // or we can call it like in below examples:
    callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    mintFee = networkConfig[chainId]["mintFee"]

    arguments = [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit, dogTokenUris, mintFee]

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Ensure the RandomIpfsNft contract is a valid consumer of the VRFCoordinatorV2Mock contract.
    if (developmentChains.includes(network.name)) {
        log(`Adding Consumer...`)
        const addConsumerTx = await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
        await addConsumerTx.wait(1)
        const getConsumer = await vrfCoordinatorV2Mock.getSubscription(subscriptionId)
        const { 0: balance, 1: reqCount, 2: owner, 3: consumer } = getConsumer
        log(`Consumer Successfully Added! Consumers: ${consumer}`)
    }

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, arguments)
    }
}

module.exports.tags = ["all", "randomnft", "main"]
