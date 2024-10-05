export const chariteaAbi = [
  { "inputs": [], "name": "UnauthorizedWithdrawal", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundIndex",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "worldIdProof",
        "type": "string"
      }
    ],
    "name": "FundCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundIndex",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "donator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundDonated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundIndex",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "data", "type": "string" },
      { "internalType": "string", "name": "worldIdProof", "type": "string" }
    ],
    "name": "createFund",
    "outputs": [
      { "internalType": "uint256", "name": "fundIndex", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "fundIndex", "type": "uint256" }
    ],
    "name": "donateFund",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "funds",
    "outputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "string", "name": "data", "type": "string" },
      { "internalType": "string", "name": "worldIdProof", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "fundIndex", "type": "uint256" }
    ],
    "name": "withdrawFund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const
