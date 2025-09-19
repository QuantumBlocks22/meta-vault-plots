import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { META_VAULT_PLOTS_ABI } from "@/lib/contract";
import { encryptPlotData, decryptPlotData, verifyFHEIntegrity } from "@/lib/fhe";

interface PlotData {
  id: string;
  x: number;
  y: number;
  status: 'encrypted' | 'owned' | 'available' | 'restricted';
  owner?: string;
  encryptionLevel?: string;
  price?: number;
  isVerified?: boolean;
}

// Generate sample grid data
const generateGridData = (): PlotData[] => {
  const plots: PlotData[] = [];
  const statuses: PlotData['status'][] = ['encrypted', 'owned', 'available', 'restricted'];
  
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 15; y++) {
      plots.push({
        id: `plot-${x}-${y}`,
        x,
        y,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        owner: Math.random() > 0.7 ? `0x${Math.random().toString(16).substring(2, 8)}...` : undefined,
        encryptionLevel: Math.random() > 0.5 ? 'FHE-256' : 'FHE-128'
      });
    }
  }
  return plots;
};

const LandGrid = () => {
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [gridData] = useState<PlotData[]>(generateGridData);
  const { address, isConnected } = useAccount();
  
  // Contract interaction hooks
  const { write: purchasePlot, data: purchaseData } = useContractWrite({
    address: "0x0000000000000000000000000000000000000000", // Replace with actual contract address
    abi: META_VAULT_PLOTS_ABI,
    functionName: "purchasePlot",
  });
  
  const { write: listPlot } = useContractWrite({
    address: "0x0000000000000000000000000000000000000000", // Replace with actual contract address
    abi: META_VAULT_PLOTS_ABI,
    functionName: "listPlotForSale",
  });
  
  const { write: delistPlot } = useContractWrite({
    address: "0x0000000000000000000000000000000000000000", // Replace with actual contract address
    abi: META_VAULT_PLOTS_ABI,
    functionName: "delistPlot",
  });
  
  // Handle plot purchase
  const handlePurchasePlot = async (plotId: number, price: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      await purchasePlot({
        args: [plotId, price, false], // plotId, price, isPrivate
        value: parseEther(price.toString()),
      });
    } catch (error) {
      console.error("Error purchasing plot:", error);
      alert("Failed to purchase plot");
    }
  };
  
  // Handle plot listing
  const handleListPlot = async (plotId: number, price: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      await listPlot({
        args: [plotId, price],
      });
    } catch (error) {
      console.error("Error listing plot:", error);
      alert("Failed to list plot");
    }
  };
  
  // Handle plot delisting
  const handleDelistPlot = async (plotId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      await delistPlot({
        args: [plotId],
      });
    } catch (error) {
      console.error("Error delisting plot:", error);
      alert("Failed to delist plot");
    }
  };
  
  // Enhanced plot creation with FHE encryption
  const handleCreatePlot = async (x: number, y: number, size: number, price: number, metadata: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      // Encrypt sensitive data before sending to contract
      const plotData = { x, y, price, metadata };
      const encryptedData = encryptPlotData(plotData);
      
      // Verify encryption integrity
      if (!verifyFHEIntegrity(plotData, encryptedData)) {
        throw new Error("FHE encryption verification failed");
      }
      
      const { write: createPlot } = useContractWrite({
        address: "0x0000000000000000000000000000000000000000", // Replace with actual contract address
        abi: META_VAULT_PLOTS_ABI,
        functionName: "createPlot",
      });
      
      await createPlot({
        args: [
          encryptedData.x, // Encrypted x coordinate
          encryptedData.y, // Encrypted y coordinate
          size,
          encryptedData.price, // Encrypted price
          encryptedData.metadata // Encrypted metadata
        ],
      });
      
      console.log("Plot created with FHE encryption");
      alert("Plot created successfully with privacy protection!");
    } catch (error) {
      console.error("Error creating plot:", error);
      alert("Failed to create plot");
    }
  };

  const getPlotClass = (status: PlotData['status']) => {
    switch (status) {
      case 'encrypted':
        return 'plot-encrypted border-2';
      case 'owned':
        return 'plot-owned border-2';
      case 'available':
        return 'plot-available border-2';
      case 'restricted':
        return 'plot-restricted border-2';
      default:
        return 'border-border';
    }
  };

  const getStatusLabel = (status: PlotData['status']) => {
    switch (status) {
      case 'encrypted':
        return '🔒 Encrypted';
      case 'owned':
        return '👑 Owned';
      case 'available':
        return '✨ Available';
      case 'restricted':
        return '⛔ Restricted';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6">
      {/* Grid Display */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 grid-overlay pointer-events-none"></div>
        <div className="relative bg-card/30 rounded-lg border border-border/50 p-4 h-full overflow-auto">
          <div className="grid grid-cols-20 gap-1 w-fit mx-auto">
            {gridData.map((plot) => (
              <div
                key={plot.id}
                className={`
                  w-8 h-8 cursor-pointer transition-all duration-200 rounded-sm
                  ${getPlotClass(plot.status)}
                  hover:scale-110 hover:z-10 relative
                `}
                onClick={() => setSelectedPlot(plot)}
                title={`Plot ${plot.x},${plot.y} - ${getStatusLabel(plot.status)}`}
              >
                <div className="w-full h-full bg-gradient-to-br from-current/20 to-current/5 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plot Details Panel */}
      <div className="lg:w-80">
        <Card className="p-6 h-full bg-card/50 border-border/50">
          {selectedPlot ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Plot {selectedPlot.x}, {selectedPlot.y}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`mt-2 ${
                    selectedPlot.status === 'encrypted' ? 'border-primary text-primary' :
                    selectedPlot.status === 'owned' ? 'border-secondary text-secondary' :
                    selectedPlot.status === 'available' ? 'border-accent text-accent' :
                    'border-destructive text-destructive'
                  }`}
                >
                  {getStatusLabel(selectedPlot.status)}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Plot ID</label>
                  <p className="font-mono text-sm">{selectedPlot.id}</p>
                </div>

                {selectedPlot.owner && (
                  <div>
                    <label className="text-sm text-muted-foreground">Owner</label>
                    <p className="font-mono text-sm">{selectedPlot.owner}</p>
                  </div>
                )}

                {selectedPlot.status === 'encrypted' && (
                  <div>
                    <label className="text-sm text-muted-foreground">Encryption Level</label>
                    <p className="font-mono text-sm text-primary">{selectedPlot.encryptionLevel}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground">Coordinates</label>
                  <p className="font-mono text-sm">X: {selectedPlot.x}, Y: {selectedPlot.y}</p>
                </div>
              </div>

              {selectedPlot.status === 'available' && (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <Button 
                    className="w-full bg-accent/20 border border-accent text-accent hover:bg-accent/30"
                    onClick={() => handlePurchasePlot(parseInt(selectedPlot.id.split('-')[1]), selectedPlot.price || 0.1)}
                    disabled={!isConnected}
                  >
                    {isConnected ? 'Purchase Plot' : 'Connect Wallet to Purchase'}
                  </Button>
                  {selectedPlot.price && (
                    <p className="text-sm text-muted-foreground text-center">
                      Price: {selectedPlot.price} ETH
                    </p>
                  )}
                </div>
              )}

              {selectedPlot.status === 'owned' && selectedPlot.owner === address && (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <Button 
                    className="w-full bg-primary/20 border border-primary text-primary hover:bg-primary/30"
                    onClick={() => handleListPlot(parseInt(selectedPlot.id.split('-')[1]), selectedPlot.price || 0.1)}
                  >
                    List for Sale
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDelistPlot(parseInt(selectedPlot.id.split('-')[1]))}
                  >
                    Delist Plot
                  </Button>
                </div>
              )}

              {selectedPlot.status === 'encrypted' && (
                <div className="pt-4 border-t border-border/50">
                  <Button 
                    className="w-full bg-primary/20 border border-primary text-primary hover:bg-primary/30"
                    disabled
                  >
                    FHE Protected - Access Restricted
                  </Button>
                </div>
              )}
              
              {/* Create New Plot Button */}
              <div className="pt-4 border-t border-border/50">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/80 hover:to-secondary/80"
                  onClick={() => handleCreatePlot(
                    selectedPlot?.x || 0, 
                    selectedPlot?.y || 0, 
                    1, 
                    selectedPlot?.price || 0.1, 
                    `Plot at ${selectedPlot?.x || 0},${selectedPlot?.y || 0}`
                  )}
                  disabled={!isConnected}
                >
                  {isConnected ? 'Create Encrypted Plot' : 'Connect Wallet to Create Plot'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  🔐 Data will be encrypted before blockchain storage
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-muted-foreground">
                  Select a plot on the grid to view details
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LandGrid;