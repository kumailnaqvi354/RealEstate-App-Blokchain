// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.29;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage, Ownable {
    uint256 private _nextPropertyId;

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
    }

    mapping(uint256 => InstallmentInfo) public installmentStatus;

    mapping(uint256 => Property) public properties;

    event PropertyListed(
        uint256 indexed propertyId, address indexed owner, uint256 price, string location, PropertyType propertyType
    );
    event PropertyPurchased(uint256 indexed propertyId, address indexed buyer, uint256 price);
    event DownPaymentReceived(uint256 indexed propertyId, address indexed buyer, uint256 amount);
    event InstallmentPaid(uint256 indexed propertyId, address indexed buyer, uint256 installmentNumber);
    event PropertyFullyPaid(uint256 indexed propertyId, address indexed newOwner);

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

    function purchaseProperty(uint256 propertyId) external payable {
        Property storage property = properties[propertyId];

        if (!property.forSale) revert PropertyNotForSale(propertyId);
        if (msg.sender == property.owner) revert CannotBuyOwnProperty(msg.sender);

        if (property.propertyType == PropertyType.INDIVIDUAL) {
            if (msg.value < property.price) {
                revert InsufficientFunds(msg.value, property.price);
            }

            payable(property.owner).transfer(property.price);

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

            // Track buyer’s installment status
            installmentStatus[propertyId] =
                InstallmentInfo({buyer: msg.sender, paidInstallments: 0, totalPaid: msg.value});

            // Mark property as reserved
            property.forSale = false;

            payable(property.owner).transfer(plan.downPayment);

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

        emit InstallmentPaid(propertyId, msg.sender, info.paidInstallments);

        // Final installment logic
        if (info.paidInstallments == plan.numOfInstallments) {
            uint256 totalToPay = plan.downPayment + (plan.installmentAmount * plan.numOfInstallments);
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
}
