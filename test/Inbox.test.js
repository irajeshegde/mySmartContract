const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // Constructor
const web3 = new Web3(ganache.provider()); // Connecting to provider
// mocha - test running framework (general purpose)  

const output = require('../compile');

let accounts, inbox;
let INITIAL_STRING = 'Blockchain';
let abi = output.contracts['Inbox.sol'].Inbox.abi;
let byteCode = output.contracts['Inbox.sol'].Inbox.evm.bytecode.object;
beforeEach(async () => {
    // get a list of all account 
    accounts = await web3.eth.getAccounts();
    // use one of those to deploy
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: byteCode,
            arguments: [INITIAL_STRING]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        })

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Blockchain');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('Yes').send({
            from: accounts[0]
        })
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Yes');

    });
});