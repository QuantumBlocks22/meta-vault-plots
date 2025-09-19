// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@fhevm/lib/Reencrypt.sol";
import "@fhevm/lib/Fhe.sol";

contract MetaVaultPlots {
    using Fhe for euint32;
    using Fhe for ebool;
    
    struct LandPlot {
        euint32 plotId;
        euint32 x;
        euint32 y;
        euint32 size;
        euint32 price;
        ebool isAvailable;
        ebool isVerified;
        string metadata;
        address owner;
        uint256 purchaseTime;
    }
    
    struct PlotTransaction {
        euint32 transactionId;
        euint32 plotId;
        euint32 price;
        ebool isPrivate;
        address buyer;
        address seller;
        uint256 timestamp;
    }
    
    struct PlotMetadata {
        euint32 plotId;
        string name;
        string description;
        string imageHash;
        euint32 rarity;
        ebool isPublic;
    }
    
    mapping(uint256 => LandPlot) public plots;
    mapping(uint256 => PlotTransaction) public transactions;
    mapping(uint256 => PlotMetadata) public plotMetadata;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public userBalance;
    
    uint256 public plotCounter;
    uint256 public transactionCounter;
    uint256 public metadataCounter;
    
    address public owner;
    address public verifier;
    uint256 public platformFee;
    
    event PlotCreated(uint256 indexed plotId, address indexed creator, uint32 x, uint32 y, uint32 size);
    event PlotPurchased(uint256 indexed plotId, address indexed buyer, address indexed seller, uint32 price);
    event PlotMetadataUpdated(uint256 indexed plotId, string name, string description);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event PlatformFeeUpdated(uint256 newFee);
    
    constructor(address _verifier, uint256 _platformFee) {
        owner = msg.sender;
        verifier = _verifier;
        platformFee = _platformFee;
    }
    
    function createPlot(
        euint32 x,
        euint32 y,
        euint32 size,
        euint32 price,
        string memory metadata
    ) public returns (uint256) {
        require(size > 0, "Plot size must be positive");
        
        uint256 plotId = plotCounter++;
        
        plots[plotId] = LandPlot({
            plotId: x, // Will be set properly
            x: x,
            y: y,
            size: size,
            price: price,
            isAvailable: Fhe.asEbool(true),
            isVerified: Fhe.asEbool(false),
            metadata: metadata,
            owner: msg.sender,
            purchaseTime: block.timestamp
        });
        
        emit PlotCreated(plotId, msg.sender, Fhe.decrypt(x), Fhe.decrypt(y), Fhe.decrypt(size));
        return plotId;
    }
    
    function purchasePlot(
        uint256 plotId,
        euint32 price,
        ebool isPrivate
    ) public payable returns (uint256) {
        require(plots[plotId].owner != address(0), "Plot does not exist");
        require(Fhe.decrypt(plots[plotId].isAvailable), "Plot is not available");
        require(msg.value >= Fhe.decrypt(price), "Insufficient payment");
        
        uint256 transactionId = transactionCounter++;
        
        // Create transaction record
        transactions[transactionId] = PlotTransaction({
            transactionId: price, // Will be set properly
            plotId: Fhe.asEuint32(plotId),
            price: price,
            isPrivate: isPrivate,
            buyer: msg.sender,
            seller: plots[plotId].owner,
            timestamp: block.timestamp
        });
        
        // Update plot ownership
        plots[plotId].owner = msg.sender;
        plots[plotId].isAvailable = Fhe.asEbool(false);
        plots[plotId].purchaseTime = block.timestamp;
        
        // Transfer funds (minus platform fee)
        uint256 sellerAmount = msg.value - (msg.value * platformFee / 10000);
        payable(plots[plotId].seller).transfer(sellerAmount);
        
        // Update user balances
        userBalance[msg.sender] = userBalance[msg.sender] + Fhe.asEuint32(uint32(sellerAmount));
        
        emit PlotPurchased(plotId, msg.sender, plots[plotId].seller, Fhe.decrypt(price));
        return transactionId;
    }
    
    function updatePlotMetadata(
        uint256 plotId,
        string memory name,
        string memory description,
        string memory imageHash,
        euint32 rarity,
        ebool isPublic
    ) public {
        require(plots[plotId].owner == msg.sender, "Only plot owner can update metadata");
        
        plotMetadata[plotId] = PlotMetadata({
            plotId: Fhe.asEuint32(plotId),
            name: name,
            description: description,
            imageHash: imageHash,
            rarity: rarity,
            isPublic: isPublic
        });
        
        emit PlotMetadataUpdated(plotId, name, description);
    }
    
    function verifyPlot(uint256 plotId, ebool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify plots");
        require(plots[plotId].owner != address(0), "Plot does not exist");
        
        plots[plotId].isVerified = isVerified;
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, Fhe.decrypt(reputation));
    }
    
    function getPlotInfo(uint256 plotId) public view returns (
        uint32 x,
        uint32 y,
        uint32 size,
        uint32 price,
        bool isAvailable,
        bool isVerified,
        address owner,
        uint256 purchaseTime
    ) {
        LandPlot storage plot = plots[plotId];
        return (
            Fhe.decrypt(plot.x),
            Fhe.decrypt(plot.y),
            Fhe.decrypt(plot.size),
            Fhe.decrypt(plot.price),
            Fhe.decrypt(plot.isAvailable),
            Fhe.decrypt(plot.isVerified),
            plot.owner,
            plot.purchaseTime
        );
    }
    
    function getTransactionInfo(uint256 transactionId) public view returns (
        uint32 plotId,
        uint32 price,
        bool isPrivate,
        address buyer,
        address seller,
        uint256 timestamp
    ) {
        PlotTransaction storage transaction = transactions[transactionId];
        return (
            Fhe.decrypt(transaction.plotId),
            Fhe.decrypt(transaction.price),
            Fhe.decrypt(transaction.isPrivate),
            transaction.buyer,
            transaction.seller,
            transaction.timestamp
        );
    }
    
    function getPlotMetadata(uint256 plotId) public view returns (
        string memory name,
        string memory description,
        string memory imageHash,
        uint32 rarity,
        bool isPublic
    ) {
        PlotMetadata storage metadata = plotMetadata[plotId];
        return (
            metadata.name,
            metadata.description,
            metadata.imageHash,
            Fhe.decrypt(metadata.rarity),
            Fhe.decrypt(metadata.isPublic)
        );
    }
    
    function getUserReputation(address user) public view returns (uint32) {
        return Fhe.decrypt(userReputation[user]);
    }
    
    function getUserBalance(address user) public view returns (uint32) {
        return Fhe.decrypt(userBalance[user]);
    }
    
    function setPlatformFee(uint256 newFee) public {
        require(msg.sender == owner, "Only owner can set platform fee");
        require(newFee <= 1000, "Platform fee cannot exceed 10%");
        
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    function withdrawPlatformFees() public {
        require(msg.sender == owner, "Only owner can withdraw platform fees");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        payable(owner).transfer(balance);
    }
    
    function listPlotForSale(uint256 plotId, euint32 price) public {
        require(plots[plotId].owner == msg.sender, "Only plot owner can list for sale");
        require(Fhe.decrypt(plots[plotId].isVerified), "Plot must be verified to list");
        
        plots[plotId].price = price;
        plots[plotId].isAvailable = Fhe.asEbool(true);
    }
    
    function delistPlot(uint256 plotId) public {
        require(plots[plotId].owner == msg.sender, "Only plot owner can delist");
        
        plots[plotId].isAvailable = Fhe.asEbool(false);
    }
}
