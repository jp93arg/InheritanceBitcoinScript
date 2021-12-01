const { program } = require('commander');
const bitcoin = require('bitcoinjs-lib');
const { inheritor } = require('./wallets.json');
const witnessStackToScriptWitness = require('./tools/witnessStackToScriptWitness');
const bip65 = require('bip65');
const { ECPair } = require('ecpair');

const network = bitcoin.networks.regtest;

program
	.requiredOption('-w, --witness <string>', 'witness script')
	.requiredOption('-t, --inputTxId <string>', 'input transaction id')
	.requiredOption('-i, --inputTxIndex <number>', 'input transaction index')
	.requiredOption('-h, --txHex <string>', 'raw input transaction in hexadecimal')
	.requiredOption('-v, --outputValue <number>', 'output value (input - fees)')
    .option('-l, --locktime <number>', 'unix timestamp since when the inheritor key can spend');

program.parse();

const options = program.opts();
const witnessScript = options.witness;
const inputTxId = options.inputTxId;
const inputTxIndex = Number(options.inputTxIndex);
const txHex = options.txHex;
const outputValue = Number(options.outputValue);
const outputValueInSatoshis = outputValue * 100000000;

const keyPairInheritor = ECPair.fromWIF(inheritor[1].wif, network);

const psbt = new bitcoin.Psbt({ network });
const lockTime = options.locktime ? bip65.encode({utc: Number(options.locktime)}) : bip65.encode({utc: Math.floor(Date.now() / 1000) + (3600 * 24 * 365)});
psbt.setLocktime(lockTime);

psbt.addInput({
	hash: inputTxId,
	index: inputTxIndex,
  sequence: 0xfffffffe, 
	nonWitnessUtxo: Buffer.from(txHex, 'hex'),
  witnessScript: Buffer.from(witnessScript, 'hex')
});

psbt.addOutput({
  address: inheritor[1].p2wpkh,
  value: outputValueInSatoshis
});

psbt.signInput(0, keyPairInheritor);

const getFinalScripts = (inputIndex, input, script) => {
  const decompiled = bitcoin.script.decompile(script)
  if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
    throw new Error(`Can not finalize input #${inputIndex}`)
  }

  const redeemLogic = bitcoin.payments.p2wsh({
    redeem: {
      input: bitcoin.script.compile([
        input.partialSig[0].signature,
        bitcoin.opcodes.OP_FALSE,
      ]),
      output: Buffer.from(witnessScript, 'hex')
    }
  })

  return {
    finalScriptWitness: witnessStackToScriptWitness(redeemLogic.witness)
  }
}

psbt.finalizeInput(0, getFinalScripts);

const rawTx = psbt.extractTransaction(true).toHex();

console.log('Transaction hexadecimal:')
console.log(rawTx);
console.log(`bitcoin-cli sendrawtransaction ${rawTx}`);
