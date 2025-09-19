// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MetaVaultPlots {
    
    struct LandPlot {
        uint32 plotId;
        uint32 x;
        uint32 y;
        uint32 size;
        uint256 price;
        bool isAvailable;
        bool isVerified;
        string metadata;
        address owner;
        uint256 purchaseTime;
        bytes32 encryptedData; // For privacy protection
    }
    
    struct PlotTransaction {
        uint32 transactionId;
        uint32 plotId;
        uint256 price;
        bool isPrivate;
        address buyer;
        address seller;
        uint256 timestamp;
        bytes32 encryptedDetails; // For privacy protection
    }
    
    struct PlotMetadata {
        uint32 plotId;
        string name;
        string description;
        string imageHash;
        uint32 rarity;
        bool isPublic;
        bytes32 encryptedMetadata; // For privacy protection
    }
    
    mapping(uint256 => LandPlot) public plots;
    mapping(uint256 => PlotTransaction) public transactions;
    mapping(uint256 => PlotMetadata) public plotMetadata;
    mapping(address => uint32) public userReputation;
    mapping(address => uint256) public userBalance;
    mapping(address => bytes32) public userEncryptedData; // Encrypted user data
    
    uint256 public plotCounter;
    uint256 public transactionCounter;
    uint256 public metadataCounter;
    
    address public owner;
    address public verifier;
    uint256 public platformFee;
    
    event PlotCreated(uint256 indexed plotId, address indexed creator, uint32 x, uint32 y, uint32 size);
    event PlotPurchased(uint256 indexed plotId, address indexed buyer, address indexed seller, uint256 price);
    event PlotMetadataUpdated(uint256 indexed plotId, string name, string description);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event PlatformFeeUpdated(uint256 newFee);
    event DataEncrypted(address indexed user, bytes32 encryptedData);
    
    constructor(address _verifier, uint256 _platformFee) {
        owner = msg.sender;
        verifier = _verifier;
        platformFee = _platformFee;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    function createPlot(
        uint32 x,
        uint32 y,
        uint32 size,
        uint256 price,
        string memory metadata,
        bytes32 encryptedData
    ) public returns (uint256) {
        require(size > 0, "Plot size must be positive");
        require(price > 0, "Price must be positive");
        
        uint256 plotId = plotCounter++;
        
        plots[plotId] = LandPlot({
            plotId: uint32(plotId),
            x: x,
            y: y,
            size: size,
            price: price,
            isAvailable: true,
            isVerified: false,
            metadata: metadata,
            owner: msg.sender,
            purchaseTime: block.timestamp,
            encryptedData: encryptedData
        });
        
        emit PlotCreated(plotId, msg.sender, x, y, size);
        return plotId;
    }
    
    function purchasePlot(
        uint256 plotId,
        uint256 price,
        bool isPrivate,
        bytes32 encryptedDetails
    ) public payable returns (uint256) {
        require(plots[plotId].owner != address(0), "Plot does not exist");
        require(plots[plotId].isAvailable, "Plot is not available");
        require(msg.value >= price, "Insufficient payment");
        require(block.timestamp <= plots[plotId].purchaseTime + 365 days, "Plot purchase window expired");
        
        uint256 transactionId = transactionCounter++;
        
        // Create transaction record
        transactions[transactionId] = PlotTransaction({
            transactionId: uint32(transactionId),
            plotId: uint32(plotId),
            price: price,
            isPrivate: isPrivate,
            buyer: msg.sender,
            seller: plots[plotId].owner,
            timestamp: block.timestamp,
            encryptedDetails: encryptedDetails
        });
        
        // Update plot ownership
        plots[plotId].owner = msg.sender;
        plots[plotId].isAvailable = false;
        plots[plotId].purchaseTime = block.timestamp;
        
        // Transfer funds (minus platform fee)
        uint256 sellerAmount = msg.value - (msg.value * platformFee / 10000);
        payable(plots[plotId].seller).transfer(sellerAmount);
        
        // Update user balances
        userBalance[msg.sender] += sellerAmount;
        
        emit PlotPurchased(plotId, msg.sender, plots[plotId].seller, price);
        return transactionId;
    }
    
    function updatePlotMetadata(
        uint256 plotId,
        string memory name,
        string memory description,
        string memory imageHash,
        uint32 rarity,
        bool isPublic,
        bytes32 encryptedMetadata
    ) public {
        require(plots[plotId].owner == msg.sender, "Only plot owner can update metadata");
        
        plotMetadata[plotId] = PlotMetadata({
            plotId: uint32(plotId),
            name: name,
            description: description,
            imageHash: imageHash,
            rarity: rarity,
            isPublic: isPublic,
            encryptedMetadata: encryptedMetadata
        });
        
        emit PlotMetadataUpdated(plotId, name, description);
    }
    
    function verifyPlot(uint256 plotId, bool isVerified) public onlyVerifier {
        require(plots[plotId].owner != address(0), "Plot does not exist");
        plots[plotId].isVerified = isVerified;
    }
    
    function updateReputation(address user, uint32 reputation) public onlyVerifier {
        require(user != address(0), "Invalid user address");
        userReputation[user] = reputation;
        emit ReputationUpdated(user, reputation);
    }
    
    function encryptUserData(bytes32 encryptedData) public {
        userEncryptedData[msg.sender] = encryptedData;
        emit DataEncrypted(msg.sender, encryptedData);
    }
    
    function getPlotInfo(uint256 plotId) public view returns (
        uint32 x,
        uint32 y,
        uint32 size,
        uint256 price,
        bool isAvailable,
        bool isVerified,
        address owner,
        uint256 purchaseTime
    ) {
        LandPlot storage plot = plots[plotId];
        return (
            plot.x,
            plot.y,
            plot.size,
            plot.price,
            plot.isAvailable,
            plot.isVerified,
            plot.owner,
            plot.purchaseTime
        );
    }
    
    function getTransactionInfo(uint256 transactionId) public view returns (
        uint32 plotId,
        uint256 price,
        bool isPrivate,
        address buyer,
        address seller,
        uint256 timestamp
    ) {
        PlotTransaction storage transaction = transactions[transactionId];
        return (
            transaction.plotId,
            transaction.price,
            transaction.isPrivate,
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
            metadata.rarity,
            metadata.isPublic
        );
    }
    
    function getUserReputation(address user) public view returns (uint32) {
        return userReputation[user];
    }
    
    function getUserBalance(address user) public view returns (uint256) {
        return userBalance[user];
    }
    
    function getUserEncryptedData(address user) public view returns (bytes32) {
        return userEncryptedData[user];
    }
    
    function setPlatformFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Platform fee cannot exceed 10%");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    function withdrawPlatformFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }
    
    function listPlotForSale(uint256 plotId, uint256 price) public {
        require(plots[plotId].owner == msg.sender, "Only plot owner can list for sale");
        require(plots[plotId].isVerified, "Plot must be verified to list");
        
        plots[plotId].price = price;
        plots[plotId].isAvailable = true;
    }
    
    function delistPlot(uint256 plotId) public {
        require(plots[plotId].owner == msg.sender, "Only plot owner can delist");
        plots[plotId].isAvailable = false;
    }
    
    function getEncryptedPlotData(uint256 plotId) public view returns (bytes32) {
        return plots[plotId].encryptedData;
    }
    
    function getEncryptedTransactionData(uint256 transactionId) public view returns (bytes32) {
        return transactions[transactionId].encryptedDetails;
    }
    
    function getEncryptedMetadata(uint256 plotId) public view returns (bytes32) {
        return plotMetadata[plotId].encryptedMetadata;
    }
}