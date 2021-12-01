#!/usr/bin/env node

/**
 * - Generate wallets (owner, inheritor) based on bitcointestwalletsgenerator (https://github.com/bitcoin-studio/bitcoin-test-wallets-generator)
 * - Create a json file with all cryptographic materials
 */

const { execSync } = require('child_process');
const fs = require('fs');

execSync('npx bitcointestwalletsgenerator --entropy 32');

const wallets = JSON.parse(fs.readFileSync('wallets.json', 'utf8'));
const newWallets = {};
newWallets.owner = wallets.alice;
newWallets.inheritor = wallets.bob;
newWallets.inheritorTwo = wallets.carol;
newWallets.inheritorThree = wallets.dave;
fs.writeFileSync('wallets.json', JSON.stringify(newWallets, null, 2));