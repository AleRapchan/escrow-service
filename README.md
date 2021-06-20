# Escrow Smart Contract

Design Patterns for Blockchain

![Logo](http://alexandrebarros.com/global/escrow.png)

# About Escrow Pattern

An escrow is an arrangement for a third party to hold the
assets of a transaction temporarily

- The smart contract holds the asset
- The rules of the smart contract may be the third party
- The use of an escrow account in a transaction adds a degree of safety for both parties

## Variants and features

- Contingent beneficiary
- Decreasing term payout
- Deferred payment
- Endowment
- Escheatment
- Security Deposit
- Proof of funds
- Restricted funds
- Arbitration
- Trust Fund
- Annuity
- Trustless

# Escrow Project

Three party transaction:

- Buyer
- Seller
- Agent

This projects utilizes a Role-based access control pattern.

## Flow

- Conditions for release are set
- Buyer transfers funds to contract
- If conditions met
  - Agent releases to Seller
- If conditions fail
  - Agent releases to Buyer
- Agent gets a % or fixed fee

## Smart contract

- [x] Use RBAC pattern
- [x] Make parties payable
- [x] Agent can release or revert
- [x] Fixed fee for agent

## RBAC Pattern

Role-based access control (RBAC) is a method of restricting network access based on the roles of individual users within an enterprise. RBAC lets employees have access rights only to the information they need to do their jobs and prevents them from accessing information that doesn't pertain to them.

## Instructions

Using Remix IDE (https://remix.ethereum.org/)

1. To start a transaction, an escrow agent (e.g.: accounts[0]), deploy the Smart Contract informing:

- Buyer's address (e.g.: accounts[1])
- Seller's address (e.g.: accounts[2])
- The value of the transaction in Ethers (e.g.: 25)

2. Change to the Buyer's account, select a amount corresponding to the price of the product and call BuyerSendPayment() function. Once the transaction is made, a 1 Eth fee is transfered to the escrow agent and the rest will stay locked in the valt (smart contract);

3. Change to the Seller's account then call SellerClaimPayment(). This simulate the moment the Seller delivered the product to the Buyer;

4. Return to the Buyer's account. Now you can choose if you received the product and then call BuyerConfirmDeliver() function or if you had problems, just call BuyerDenyDeliver(). If you confirm that you received the product, the vault will release the funds to the seller otherwise, the escrow agent will need to decide if he will release it, calling AgentConfirmTransaction(), or not, calling AgentCancelTransaction(), depending of the case;

Only the escrow agent can verify the vault balance using VaultBalance().

## Roadmap: Web interface

- Website represents the seller
- Buyer interface
  - The buyer selects the escrow agent
  - The buyer selects the conditions
- The buyer sends the funds
  - Agent interface
- The agent checks condition
- Agent releases or reverts

## Run Locally

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
  npm init
  npm install express --save
  npm install truffle
  npm install @openzeppelin/contracts
  npm install --save-exact openzeppelin-solidity
```

Start the server

```bash
  truffle init
  npm run start
```

Deploy with Truffle

```javascript
  truffle develop
  #compile
  #migrate
```

In the console we run compile and then migrate. Compilation generates the contract bytecode and application binary interface (ABI). Migration sends transactions to the network that create instances of our smart contracts.

The Truffle console also exposes contract abstractions and web3.js if we want to manually interact with our contracts after deployment.

## Author

- [@AleRapchan](https://www.github.com/AleRapchan)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/alerapchan)

## Documentation

[Full Documentation](https://rapchan.gitbook.io/green-energy-tracker/)

## Support

For support, email blockchain@alexandrebarros.com or join our Slack channel.

## Appendix

- Web3.js: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#contract-events
- Bootstrap 5: https://getbootstrap.com/docs/5.0/getting-started/introduction/
- Metamask: https://docs.metamask.io/guide/
- Remix: https://remix-ide.readthedocs.io/en/latest/
- React: https://reactjs.org/docs/getting-started.html
- Solidity: https://docs.soliditylang.org/en/v0.4.24/
- Ganache: https://www.trufflesuite.com/docs/ganache/overview

# License

The MIT License (MIT)

Copyright (c) 2021 Alexandre Barros

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
