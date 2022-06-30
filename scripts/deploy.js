// const { ethers } = require("hardhat") - Do not enable this as it leads to HH9 error
const { ethers, run, network } = require("hardhat")
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Currently deployed to: ${simpleStorage.address}`)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block TX(s)...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    // Get a number:
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value: ${currentValue}`)
    // Update number:
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value: ${updatedValue}`)
}
//async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("not verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
