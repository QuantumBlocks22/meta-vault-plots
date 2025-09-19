// Contract ABI for MetaVaultPlots
export const META_VAULT_PLOTS_ABI = [
  {
    "inputs": [
      {"internalType": "uint32", "name": "x", "type": "uint32"},
      {"internalType": "uint32", "name": "y", "type": "uint32"},
      {"internalType": "uint32", "name": "size", "type": "uint32"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "string", "name": "metadata", "type": "string"},
      {"internalType": "bytes32", "name": "encryptedData", "type": "bytes32"}
    ],
    "name": "createPlot",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "plotId", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "bool", "name": "isPrivate", "type": "bool"},
      {"internalType": "bytes32", "name": "encryptedDetails", "type": "bytes32"}
    ],
    "name": "purchasePlot",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "plotId", "type": "uint256"}],
    "name": "getPlotInfo",
    "outputs": [
      {"internalType": "uint32", "name": "x", "type": "uint32"},
      {"internalType": "uint32", "name": "y", "type": "uint32"},
      {"internalType": "uint32", "name": "size", "type": "uint32"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "bool", "name": "isAvailable", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "purchaseTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "plotId", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "listPlotForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "plotId", "type": "uint256"}],
    "name": "delistPlot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "encryptedData", "type": "bytes32"}],
    "name": "encryptUserData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract address (will be set after deployment)
export const META_VAULT_PLOTS_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
