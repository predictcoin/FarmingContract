import { expect } from "chai";
import { ethers } from "hardhat"
import { Signer, Contract, BigNumber as _BigNumber } from "ethers";

let signers: Signer[], 
  farm: Contract, 
  PrederA: Signer, 
  pred: Contract,
  PrederB: Signer,
  lp1: Contract;
const predPerBlock = 1000000000;
let wallet: string;

let poolBefore: {
  lpToken: string, 
  allocPoint: _BigNumber, 
  lastRewardBlock: _BigNumber, 
  accPredPerShare: _BigNumber
};

const [depositA, depositB] = [1000, 2000]
const multiplier = 10000000

describe("Farming Contract Tests", () => {

  beforeEach( async () => {
    signers = await ethers.getSigners();
    [PrederA, PrederB] = signers

    const Pred = await ethers.getContractFactory("Predictcoin");
    pred = await Pred.deploy();

    const Farm = await ethers.getContractFactory("MasterPred");
    farm = await Farm.deploy(pred.address, predPerBlock, 0)
    wallet = await farm.wallet()

    const Lp1 = await ethers.getContractFactory("LPToken1");
    lp1 = await Lp1.deploy()
  })

  it("should initialise contract state variables", async () => {
    expect(await farm.pred()).to.equal(pred.address)
    expect(await farm.predPerBlock()).to.equal(predPerBlock)
    expect(await farm.startBlock()).to.equal(0)
    expect(await farm.totalAllocPoint()).to.equal(200)
    expect(await farm.poolLength()).to.equal(1)
  })
  
  it("should add the Pred Token Pool", async () => {
    const pool = await farm.poolInfo(0)
    expect(pool.lpToken).to.equal(pred.address)
    expect(pool.allocPoint.toString()).to.equal("200")
    expect(pool.lastRewardBlock.toString()).to.equal("0")
    expect(pool.accPredPerShare.toString()).to.equal("0")
  })

  it("should update multiplier", async () => {
    await farm.updateMultiplier(multiplier)
    expect(await farm.BONUS_MULTIPLIER()).to.equal(multiplier)
  })

  it("should allow only owner add a new pool", async () => {
    await expect(farm.add(4000, PrederA, false, {from: PrederB})).to.be.reverted;
  })

  it("should add a new pool", async () => {
    const poolAddr = lp1.address
    await farm.add(4000, poolAddr, false)
    const pool = await farm.poolInfo(1)
    expect(pool.lpToken).to.equal(poolAddr)
    expect(pool.allocPoint.toString()).to.equal("4000")
    expect(pool.accPredPerShare.toString()).to.equal("0")
  })

  it("should allow only owner set allocation point", async () => {
    await expect(farm.set(0, 10000000, false, {from: PrederB})).to.be.reverted
  })

  it("should set allocation point", async () => {
    await farm.set(0, 10000000, false)
    const pool = await farm.poolInfo(0)
    expect(pool.allocPoint).to.equal(10000000)
    expect(await farm.totalAllocPoint()).to.equal(10000000)
  })

  it("should allow only owner set migrator", async () => {
    await expect(farm.setMigrator(PrederA, {from: PrederB})).to.be.reverted
  })

  it("should set migrator", async () => {
    const migrator = await PrederB.getAddress()
    await farm.setMigrator(migrator)
    expect(await farm.migrator()).to.equal(migrator)
  })

  it("should return multiplier across blocks", async () => {
    const bonus_multiplier = await farm.BONUS_MULTIPLIER()
    expect(await farm.getMultiplier(110, 200)).to.be.equal(bonus_multiplier*(200-110))
  })

  context("when user deposits when wallet is empty", async () => {
    beforeEach(async () => {
      await pred.approve(await farm.address, 100000000)
      await farm.updateMultiplier(multiplier)
      poolBefore = await farm.poolInfo(0)
      await farm.deposit(0, depositA)
    })

    it("should update user info", async () => {
      const userInfo = await farm.userInfo(0, await PrederA.getAddress())
      expect(userInfo.amount).to.equal(depositA)
      expect(userInfo.rewardDebt).to.equal(0)
      expect(await farm.totalRewardDebt()).to.equal(0)
      expect(await farm.pendingPred(0, await PrederA.getAddress())).to.equal(0)
    })

    it("should update pool", async () => {
      const poolAfter = await farm.poolInfo(0)
      expect(poolAfter.lastRewardBlock).to.gt(poolBefore.lastRewardBlock)
      expect(poolAfter.accPredPerShare).to.equal(poolBefore.accPredPerShare)
    })
  
    it("should update user pending Pred when wallet increases balance", async () => {
      await pred.transfer(wallet, (10**17).toString());
      console.log(await pred.balanceOf(wallet));
      const pending = (multiplier*predPerBlock).toString();
      expect(await farm.pendingPred(0, await PrederA.getAddress())).to.equal(pending)
    })
  })

  context("when user deposits when wallet is not empty", async () => {
      
  })

  context("when two users deposit across two pools", async () => {

  })

  xit("should withdraw funds and forfeit rewards with Emergency withdraw", () => {

  })
})