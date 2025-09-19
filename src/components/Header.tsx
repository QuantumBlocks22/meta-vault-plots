import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import logoImage from "@/assets/metaverse-logo.png";

const Header = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  return (
    <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 circuit-bg"></div>
      <div className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img 
              src={logoImage} 
              alt="Meta Vault Plots" 
              className="w-12 h-12 neon-glow"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Meta Vault Plots
              </h1>
              <p className="text-muted-foreground text-sm">
                FHE-Protected Virtual Land Registry
              </p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right text-sm">
              <span className="text-muted-foreground">Network Status</span>
              <span className="text-accent font-mono">
                {isConnected ? `Chain ID: ${chainId}` : 'Not Connected'}
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;