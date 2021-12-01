const { program } = require('commander');
const bitcoin = require('bitcoinjs-lib');
const { inheritor, inheritorTwo, inheritorThree } = require('./wallets.json');
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

const keyPairInheritorOne = ECPair.fromWIF(inheritor[1].wif, network);
const keyPairInheritorTwo = ECPair.fromWIF(inheritorTwo[1].wif, network);
const keyPairInheritorThree = ECPair.fromWIF(inheritorThree[1].wif, network);

const inheritors = [inheritor, inheritorTwo, inheritorThree];
const signers = [keyPairInheritorOne, keyPairInheritorTwo];

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

for (const inheritor of inheritors) {
    psbt.addOutput({
        address: inheritor[1].p2wpkh,
        value: (outputValueInSatoshis / inheritors.length)
    });
}

for (const signer of signers) {
    psbt.signInput(0, signer);
}

const getFinalScripts = (inputIndex, input, script) => {
  const decompiled = bitcoin.script.decompile(script)
  if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
    throw new Error(`Can not finalize input #${inputIndex}`)
  }

  const redeemScriptInputSignatures = [];
  for (const sig of input.partialSig) {
    redeemScriptInputSignatures.push(sig.signature);
  }

  const redeemLogic = bitcoin.payments.p2wsh({
    redeem: {
      input: bitcoin.script.compile([
        bitcoin.opcodes.OP_0,
        ...redeemScriptInputSignatures,
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
