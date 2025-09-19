# Vercel Deployment Guide for Meta Vault Plots

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare your environment variables

## Step-by-Step Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `QuantumBlocks22/meta-vault-plots`

### Step 2: Configure Build Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Leave as default (./)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Set Environment Variables

In the Vercel dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_rpc_url_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
```

**Note**: Replace the placeholder values with your actual API keys and configuration.

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your app will be available at the provided Vercel URL

### Step 5: Custom Domain (Optional)

1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Important Configuration Notes

### Build Configuration

- **Node.js Version**: 18.x (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables

Make sure to set these environment variables in Vercel:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Sepolia testnet chain ID |
| `NEXT_PUBLIC_RPC_URL` | `your_rpc_url_here` | RPC endpoint |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `your_wallet_connect_project_id` | WalletConnect project ID |
| `NEXT_PUBLIC_INFURA_API_KEY` | `your_infura_api_key` | Infura API key |

### Vercel Configuration File

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## Post-Deployment Steps

### 1. Verify Deployment

1. Visit your Vercel URL
2. Test wallet connection
3. Verify all features work correctly

### 2. Update Contract Address

1. Deploy your smart contracts to Sepolia
2. Update the contract address in `src/lib/contract.ts`
3. Redeploy to Vercel

### 3. Monitor Performance

1. Check Vercel Analytics
2. Monitor build logs
3. Set up error tracking if needed

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Environment Variables**: Ensure all required variables are set
3. **Wallet Connection**: Verify WalletConnect project ID is correct
4. **RPC Issues**: Check if RPC URL is accessible

### Build Logs

Check Vercel build logs for detailed error information:
1. Go to your project dashboard
2. Click on the latest deployment
3. Check the "Build Logs" tab

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to Git
2. **API Keys**: Use environment variables for all API keys
3. **CORS**: Configure CORS settings if needed
4. **HTTPS**: Vercel automatically provides HTTPS

## Performance Optimization

1. **Image Optimization**: Use Vercel's image optimization
2. **Caching**: Configure appropriate cache headers
3. **CDN**: Vercel automatically provides global CDN
4. **Bundle Size**: Monitor and optimize bundle size

## Monitoring and Analytics

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry or similar
3. **Performance Monitoring**: Use Vercel's built-in tools

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Contact Vercel support if needed

## Next Steps

After successful deployment:
1. Test all functionality
2. Deploy smart contracts
3. Update contract addresses
4. Configure custom domain
5. Set up monitoring
