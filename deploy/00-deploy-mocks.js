const { network } = require("hardhat")
const { developmentChains, BASE_FEE, GAS_PRICE_LINK, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const coordinatorArgs = [BASE_FEE, GAS_PRICE_LINK]
    const aggregatorArgs = [DECIMALS, INITIAL_PRICE]

    if (developmentChains.includes(network.name)) {
        log("----------------------------------------------------")
        log("Local Network Detected!")
        log("Deploying Mocks...")
        const vrfCoordinatorV2 = await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: coordinatorArgs,
            log: true,
        })
        log(`VRFCoordinatorV2Mock Successfully Deployed At ${vrfCoordinatorV2.address}`)

        const mockV3Aggregator = await deploy("MockV3Aggregator", {
            from: deployer,
            args: aggregatorArgs,
            log: true,
        })
        log(`MockV3Aggregator Successfully Deployed At ${mockV3Aggregator.address}`)
    }
}

module.exports.tags = ["all", "mocks"]
