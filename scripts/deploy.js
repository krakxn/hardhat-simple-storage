const { ethers, run, network } = require("hardhat") // Can lead to HH9 error if Hardhat is not initialized

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed() // Waits till it is deployed
    console.log(`Currently deployed to: ${simpleStorage.address}`)
    
    // chainId for Goerli: 5, use Chain ID List for more info
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) { // Checks for the correct chainId and Etherscan's API
        console.log("Waiting for block TX(s)...")
        await simpleStorage.deployTransaction.wait(6) // Waits 6 blocks to confirm backend
        await verify(simpleStorage.address, [])
    }
    
    // Get a number: (use `toString()` accordingly)
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value: ${currentValue}`)
    
    // Update the number:
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1) // Waits 1 block
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value: ${updatedValue}`)
}

// Function to verify contract on Etherscan
const verify = async (contractAddress, args) => {
    console.log("Verifying...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("not verified")) { // If already verified
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
