const { program } = require('commander');
const bitcoin = require('bitcoinjs-lib');
const { owner, inheritor } = require('./wallets.json');
const bip65 = require('bip65');
const { ECPair } = require('ecpair');

const network = bitcoin.networks.regtest;

program.requiredOption('-l, --locktime <number>', 'unix timestamp since when the inheritor key can spend. default is ');

program.parse();

const options = program.opts();
if (options.time) {
    if (Number(options.time) < Math.floor(Date.now() / 1000)) {
        console.error('lock time should be in the future');
        process.exit(1);
    }
}

const lockTime = options.locktime ? bip65.encode({ utc: Number(options.locktime) }) : bip65.encode({ utc: Math.floor(Date.now() / 1000) + (3600 * 24 * 365) });
console.log(`Timelock in UNIX timestamp: ${lockTime}`);

const keyPairOwner = ECPair.fromWIF(owner[1].wif, network);
const keyPairInheritor = ECPair.fromWIF(inheritor[1].wif, network);

const witnessScript = cltvCheckSigOutput(keyPairOwner, keyPairInheritor, lockTime);
console.log('Witness script:');
console.log(witnessScript.toString('hex'));

const p2wsh = bitcoin.payments.p2wsh({ redeem: { output: witnessScript, network }, network });
console.log('P2WSH address:');
console.log(p2wsh.address);

console.log(`bitcoin-cli sendtoaddress ${p2wsh.address} $amount`);
console.log(`example: bitcoin-cli sendtoaddress ${p2wsh.address} 0.05`);
console.log('It will return the transaction id');
console.log(`then, run the following command: bitcoin-cli getrawtransaction TX_ID true(replace TX_ID with the transaction id)`);

function cltvCheckSigOutput(owner, inheritor, lockTime) {
    return bitcoin.script.fromASM(
        `
        OP_IF
            ${owner.publicKey.toString('hex')}
            OP_CHECKSIG
        OP_ELSE
            ${bitcoin.script.number.encode(lockTime).toString('hex')}
            OP_CHECKLOCKTIMEVERIFY
            OP_DROP
            ${inheritor.publicKey.toString('hex')}
            OP_CHECKSIG
        OP_ENDIF
      `
            .trim()
            .replace(/\s+/g, ' '),
    );
};
