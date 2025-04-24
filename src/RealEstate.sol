// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.29;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RealEstate is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public _nextPropertyId;

    enum PropertyType {
        INDIVIDUAL,
        BUILDER
    }

    struct PaymentPlan {
        uint256 totalAmount;
        uint256 downPayment;
        uint256 installmentAmount;
        uint256 numOfInstallments;
        bool isActive;
    }

    struct Property {
        uint256 id;
        string location;
        uint256 price;
        address owner;
        bool forSale;
        PropertyType propertyType;
        PaymentPlan paymentPlan;
    }

    struct InstallmentInfo {
        address buyer;
        uint256 paidInstallments;
        uint256 totalPaid;
        uint256 startTime; // when down payment was made
        uint256 durationPerInstallment; // time allowed per installment
        bool disputeRaised;
    }

    mapping(uint256 => InstallmentInfo) public installmentStatus;

    mapping(uint256 => Property) public properties;

    mapping(address => bool) public blacklisted;

    event PropertyListed(
        uint256 indexed propertyId, address indexed owner, uint256 price, string location, PropertyType propertyType
    );
    event PropertyPurchased(uint256 indexed propertyId, address indexed buyer, uint256 price);
    event DownPaymentReceived(uint256 indexed propertyId, address indexed buyer, uint256 amount);
    event InstallmentPaid(uint256 indexed propertyId, address indexed buyer, uint256 installmentNumber);
    event PropertyFullyPaid(uint256 indexed propertyId, address indexed newOwner);
    event DisputeRaised(uint256 indexed propertyId, address indexed builder, address indexed buyer, string reason);
    event DisputeResolved(uint256 indexed propertyId, address indexed buyer);

    // Custom errors
    error InvalidPaymentPlan(uint256 price, uint256 totalPayments);
    error UnauthorizedCaller(address caller);
    error InvalidInputs();
    error PropertyNotForSale(uint256 propertyId);
    error CannotBuyOwnProperty(address buyer);
    error InsufficientFunds(uint256 paid, uint256 required);
    error InsufficientDownPayment(uint256 paid, uint256 required);
    error PaymentPlanNotActive(uint256 propertyId);
    error PaymentPlanAlreadyActive(uint256 propertyId);
    error PaymentPlanNotFound(uint256 propertyId);
    error PropertyAlreadyReserved(uint256 propertyId);
    error PropertyNotFound(uint256 propertyId);
    error NotInstallmentBuyer(address caller);
    error AllInstallmentsPaid(uint256 propertyId);
    error InsufficientInstallment(uint256 sent, uint256 required);
    error DisputeAlreadyRaised(uint256 propertyId);
    error InstallmentsOnTrack(uint256 propertyId);
    error DisputeNotRaised(uint256 propertyId);

    constructor() ERC721("RealEstateNFT", "RENT") Ownable(msg.sender) {}

    function listProperty(
        string memory location,
        uint256 price,
        string memory tokenURI,
        bool isBuilder,
        uint256 downPayment,
        uint256 installmentAmount,
        uint256 numOfInstallments
    ) external {
        uint256 propertyId = _nextPropertyId;
        unchecked {
            _nextPropertyId++;
        }

        PropertyType propertyType = isBuilder ? PropertyType.BUILDER : PropertyType.INDIVIDUAL;

        PaymentPlan memory paymentPlan;
        if (isBuilder) {
            uint256 totalPayments = downPayment + (installmentAmount * numOfInstallments);
            if (price > totalPayments) {
                revert InvalidPaymentPlan(price, totalPayments);
            }
            paymentPlan = PaymentPlan(price, downPayment, installmentAmount, numOfInstallments, true);
        }

        properties[propertyId] = Property({
            id: propertyId,
            location: location,
            price: price,
            owner: msg.sender,
            forSale: true,
            propertyType: propertyType,
            paymentPlan: paymentPlan
        });

        _mint(msg.sender, propertyId);
        _setTokenURI(propertyId, tokenURI);

        // Give approval to the contract to manage the NFT
        approve(address(this), propertyId);

        emit PropertyListed(propertyId, msg.sender, price, location, propertyType);
    }

    function purchaseProperty(uint256 propertyId) external payable nonReentrant {
        if (blacklisted[msg.sender]) revert UnauthorizedCaller(msg.sender);
        Property storage property = properties[propertyId];

        if (!property.forSale) revert PropertyNotForSale(propertyId);
        if (msg.sender == property.owner) revert CannotBuyOwnProperty(msg.sender);

        if (property.propertyType == PropertyType.INDIVIDUAL) {
            if (msg.value < property.price) {
                revert InsufficientFunds(msg.value, property.price);
            }

            (bool success,) = payable(property.owner).call{value: property.price}("");
            require(success, "Failed to send Ether");
            _transfer(property.owner, msg.sender, propertyId);
            property.owner = msg.sender;
            property.forSale = false;

            emit PropertyPurchased(propertyId, msg.sender, property.price);
        } else {
            PaymentPlan storage plan = property.paymentPlan;
            if (!plan.isActive) revert PaymentPlanNotActive(propertyId);
            if (installmentStatus[propertyId].buyer != address(0)) {
                revert PropertyAlreadyReserved(propertyId);
            }
            if (msg.value < plan.downPayment) {
                revert InsufficientDownPayment(msg.value, plan.downPayment);
            }
            installmentStatus[propertyId] = InstallmentInfo({
                buyer: msg.sender,
                paidInstallments: 0,
                totalPaid: msg.value,
                startTime: block.timestamp,
                durationPerInstallment: 30 days, // or any duration you want to enforce
                disputeRaised: false
            });

            // Mark property as reserved
            property.forSale = false;

            // send all Ether to owner
            (bool success,) = payable(property.owner).call{value: plan.downPayment}("");
            require(success, "Failed to send Ether");

            emit DownPaymentReceived(propertyId, msg.sender, plan.downPayment);
        }
    }

    function payInstallment(uint256 propertyId) external payable {
        InstallmentInfo storage info = installmentStatus[propertyId];
        Property storage property = properties[propertyId];
        PaymentPlan storage plan = property.paymentPlan;

        if (info.buyer != msg.sender) revert NotInstallmentBuyer(msg.sender);
        if (!plan.isActive) revert PaymentPlanNotActive(propertyId);
        if (info.paidInstallments >= plan.numOfInstallments) {
            revert AllInstallmentsPaid(propertyId);
        }
        if (msg.value < plan.installmentAmount) {
            revert InsufficientInstallment(msg.value, plan.installmentAmount);
        }

        info.paidInstallments++;
        info.totalPaid += msg.value;

        (bool success,) = payable(address(this)).call{value: msg.value}("");
        require(success, "Installment failed");

        emit InstallmentPaid(propertyId, msg.sender, info.paidInstallments);

        // Final installment logic
        if (info.paidInstallments == plan.numOfInstallments) {
            uint256 totalToPay = (plan.installmentAmount * plan.numOfInstallments);
            address seller = property.owner;

            // Transfer funds from contract to seller
            (bool success,) = payable(seller).call{value: totalToPay}("");
            require(success, "Transfer to seller failed");

            // Transfer NFT ownership
            _transfer(seller, msg.sender, propertyId);
            property.owner = msg.sender;
            plan.isActive = false;

            emit PropertyFullyPaid(propertyId, msg.sender);
        }
    }

    function raiseDispute(uint256 propertyId) external {
        Property storage property = properties[propertyId];
        InstallmentInfo storage info = installmentStatus[propertyId];

        if (property.propertyType != PropertyType.BUILDER) revert InvalidInputs();
        if (msg.sender != property.owner) revert UnauthorizedCaller(msg.sender);
        if (info.buyer == address(0)) revert InvalidInputs();
        if (info.disputeRaised) revert DisputeAlreadyRaised(propertyId);

        uint256 elapsed = block.timestamp - info.startTime;
        uint256 expectedInstallments = elapsed / info.durationPerInstallment;

        if (info.paidInstallments >= expectedInstallments) revert InstallmentsOnTrack(propertyId);

        info.disputeRaised = true;

        emit DisputeRaised(propertyId, msg.sender, info.buyer, "Installments not paid on time");
    }

    function resolveDispute(uint256 propertyId) external onlyOwner {
        InstallmentInfo storage info = installmentStatus[propertyId];
        Property storage property = properties[propertyId];

        if (!info.disputeRaised) revert DisputeNotRaised(propertyId);

        uint256 elapsed = block.timestamp - info.startTime;
        uint256 expectedInstallments = elapsed / info.durationPerInstallment;

        if (info.paidInstallments >= expectedInstallments) {
            // Dispute is no longer valid, dismiss it
            info.disputeRaised = false;
            emit DisputeResolved(propertyId, info.buyer);
            return;
        }

        address buyer = info.buyer;
        uint256 refundAmount = info.totalPaid - property.paymentPlan.downPayment;

        // Reset property state
        property.forSale = true;

        // Clear buyer info
        installmentStatus[propertyId] = InstallmentInfo({
            buyer: address(0),
            paidInstallments: 0,
            totalPaid: 0,
            startTime: 0,
            durationPerInstallment: 0,
            disputeRaised: false
        });

        blacklisted[buyer] = true; // Blacklist the buyer

        // Refund the buyer
        if (refundAmount > 0) {
            (bool success,) = payable(buyer).call{value: refundAmount}("");
            require(success, "Refund to buyer failed");
        }
        emit DisputeResolved(propertyId, buyer);
    }

    receive() external payable {}
    fallback() external payable {}
}
