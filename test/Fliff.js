const { tokens, protocols } = require("hardlydifficult-ethereum-contracts");
const truffleAssert = require("truffle-assertions");
// const BigNumber = require("bignumber.js")
const Fliff = artifacts.require("Fliff");

contract("Fliff", accounts => {

    let token;

    before(async () => {
        token = await tokens.dai.deploy(web3, accounts[1]);
        fliffContract = await Fliff.new(token.address)   
        await token.mint(accounts[0], 5000000, {
            from: accounts[1],
            gas: 4700000
            
          }); 
    })

    describe('recording debt', () => {
       it('sets the state of global balances appropriately', async () =>{
           await fliffContract.recordDebt('400', accounts[3]);

           let debteeBalance = await fliffContract.getGlobalBalance(accounts[3])
           let debtorBalance  = await fliffContract.getGlobalBalance(accounts[0])
           assert(await debteeBalance.toNumber()  === 400)
           assert(await debtorBalance.toNumber()  === -400)
       })
    })

    describe('get global balance', () => {
        describe('when the address holder hasnt interacted with the contract', () => {

            it('returns a 0 balance', async ()=> {
                let balance  = await fliffContract.getGlobalBalance(accounts[8])
                assert(await balance.toNumber()  === 0)
            })
        })

        describe('when the address has a balance', () => {
            it('returns a non-negative balance', async () => {
                let balance  = await fliffContract.getGlobalBalance(accounts[0])
                assert(await balance.toNumber()  === -400)
            })
        })
    })

    describe('when settling debt', () => {
        it('should adjust the debtor and debtee appropriately', async() => {

            await token.approve(fliffContract.address, 400, {
                from: accounts[0],
                gas: 4700000
            })

            await fliffContract.debtSettled('200', accounts[3], {gas: 5700000 });
            let debteeBalance = await fliffContract.getGlobalBalance(accounts[3])
            let debtorBalance  = await fliffContract.getGlobalBalance(accounts[0])
            assert(await debteeBalance.toNumber()  === 200)
            assert(await debtorBalance.toNumber()  === -200)

        })
    })
})