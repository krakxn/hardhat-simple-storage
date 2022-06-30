const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
describe("SimpleStorage", () => {
    let simpleStorage, simpleStorageFactory // For global scope
    beforeEach(async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })
    // More tests for a serious project
    // Test 1
    it("Should start with a favourite number of 0", async () => {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        // `assert` and `expect`
        assert.equal(currentValue.toString(), expectedValue)
        // expect (currentValue.toString()).to.equal.(expectedValue)
    })
    // Test 2
    it("Should update when we call store", async () => {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })
})
