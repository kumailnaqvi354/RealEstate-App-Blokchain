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

    mapping(uint256 => Property) public properties;

    event PropertyListed(
        uint256 indexed propertyId, address indexed owner, uint256 price, string location, PropertyType propertyType
    );

    // Custom errors
    error InvalidPaymentPlan(uint256 price, uint256 totalPayments);
    error UnauthorizedCaller(address caller);

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
        _nextPropertyId++;

        PropertyType propertyType = isBuilder ? PropertyType.BUILDER : PropertyType.INDIVIDUAL;

        PaymentPlan memory paymentPlan;
        if (isBuilder) {
            uint256 totalPayments = downPayment + (installmentAmount * numOfInstallments);
            if (price < totalPayments) {
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
}
