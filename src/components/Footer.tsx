const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="absolute inset-0 circuit-bg opacity-50"></div>
      <div className="relative container mx-auto px-6 py-8">
        {/* Floating Digital Signposts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="float bg-card/50 border border-primary/50 rounded-lg p-4 text-center shadow-[var(--shadow-encrypted)]">
            <div className="text-primary text-2xl mb-2">🔐</div>
            <h3 className="font-bold text-primary mb-1">FHE Encryption</h3>
            <p className="text-xs text-muted-foreground">Fully Homomorphic Encryption protects land ownership data</p>
          </div>

          <div className="float bg-card/50 border border-secondary/50 rounded-lg p-4 text-center shadow-[var(--shadow-owned)]" style={{ animationDelay: '1s' }}>
            <div className="text-secondary text-2xl mb-2">🌐</div>
            <h3 className="font-bold text-secondary mb-1">Metaverse Ready</h3>
            <p className="text-xs text-muted-foreground">Seamlessly integrated with virtual worlds and NFT standards</p>
          </div>

          <div className="float bg-card/50 border border-accent/50 rounded-lg p-4 text-center shadow-[var(--shadow-available)]" style={{ animationDelay: '2s' }}>
            <div className="text-accent text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-accent mb-1">Zero-Knowledge</h3>
            <p className="text-xs text-muted-foreground">Prove ownership without revealing private information</p>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border/50">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            <p>© 2024 Confidential Land Registry. Powered by FHE Technology.</p>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

        {/* Network Status Bar */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-muted/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-mono">
              Network: Active | Encryption: FHE-256 | Plots: 300 Registered
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;