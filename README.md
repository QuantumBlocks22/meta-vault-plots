# Meta Vault Plots

A decentralized virtual land registry platform built with Fully Homomorphic Encryption (FHE) for privacy-preserving property rights in the metaverse.

## Features

- **FHE-Protected Land Registry**: Secure virtual land ownership with fully homomorphic encryption
- **Wallet Integration**: Seamless connection with Rainbow Wallet and other Web3 wallets
- **Smart Contract Integration**: Ethereum-based land transactions with FHE encryption
- **Privacy-Preserving**: All sensitive data is encrypted using FHE technology
- **Real-time Updates**: Live blockchain integration for land ownership changes

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/QuantumBlocks22/meta-vault-plots.git
cd meta-vault-plots
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update the environment variables in `.env.local`:
```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Smart Contract Deployment

### Prerequisites for Contract Deployment

- Hardhat
- Sepolia ETH for gas fees
- Infura or Alchemy API key

### Deploy Contracts

1. Install Hardhat dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @fhevm/lib
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Update contract address in `src/lib/contract.ts`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CHAIN_ID` | Ethereum chain ID (11155111 for Sepolia) | Yes |
| `NEXT_PUBLIC_RPC_URL` | RPC URL for blockchain connection | Yes |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_INFURA_API_KEY` | Infura API key (optional) | No |

## Features Overview

### Land Plot Management
- Create and manage virtual land plots
- FHE-encrypted plot metadata
- Privacy-preserving ownership records

### Wallet Integration
- Rainbow Wallet support
- MetaMask compatibility
- Multi-wallet support via WalletConnect

### Smart Contract Features
- FHE-encrypted land transactions
- Privacy-preserving ownership transfers
- Reputation system for users
- Platform fee management

## Security Features

- **FHE Encryption**: All sensitive data is encrypted using fully homomorphic encryption
- **Privacy-Preserving**: Land ownership details remain private
- **Secure Transactions**: Blockchain-based ownership verification
- **Reputation System**: Trust-based user verification

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in this repository
- Contact the development team

## Roadmap

- [ ] Mainnet deployment
- [ ] Additional FHE operations
- [ ] Mobile app support
- [ ] Advanced land customization
- [ ] Cross-chain compatibility

## Acknowledgments

- Zama for FHE technology
- Ethereum Foundation for blockchain infrastructure
- Rainbow team for wallet integration
- shadcn/ui for component library