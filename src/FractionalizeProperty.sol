// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalProperty is ERC1155, ERC1155Holder, Ownable {
    uint256 public currentPropertyId;

    struct Property {
        address seller;
        uint256 totalFractions;
        uint256 sellerOwnedFractions;
        uint256 fractionsForSale;
        uint256 pricePerFraction; // in wei
    }

    mapping(uint256 => Property) public properties;

    error ZeroFractions();
    error SellerOwnershipTooHigh();
    error InvalidBuyer();
    error IncorrectValueSent();
    error NotEnoughFractionsAvailable();

    event PropertyFractionalized(
        uint256 indexed propertyId,
        address indexed seller,
        uint256 totalFractions,
        uint256 sellerOwnedFractions,
        uint256 fractionsForSale,
        uint256 pricePerFraction
    );

    event FractionsPurchased(uint256 indexed propertyId, address indexed buyer, uint256 amount, uint256 totalPaid);

    constructor(string memory uri) ERC1155(uri) Ownable(msg.sender) {}

    /// @notice Mint and list fractions of a property
    function createFractionlizeProperty(uint256 totalFractions, uint256 sellerOwnedFractions, uint256 pricePerFraction)
        external
    {
        if (totalFractions == 0) revert ZeroFractions();
        if (sellerOwnedFractions > totalFractions) revert SellerOwnershipTooHigh();

        uint256 fractionsForSale = totalFractions - sellerOwnedFractions;
        uint256 propertyId = ++currentPropertyId;

        // Mint all tokens to the contract itself
        _mint(address(this), propertyId, totalFractions, "");

        // Transfer seller's portion to the seller
        if (sellerOwnedFractions > 0) {
            _safeTransferFrom(address(this), msg.sender, propertyId, sellerOwnedFractions, "");
        }
        properties[propertyId] = Property({
            seller: msg.sender,
            totalFractions: totalFractions,
            sellerOwnedFractions: sellerOwnedFractions,
            fractionsForSale: fractionsForSale,
            pricePerFraction: pricePerFraction
        });
        emit PropertyFractionalized(
            propertyId, msg.sender, totalFractions, sellerOwnedFractions, fractionsForSale, pricePerFraction
        );
    }

    function buyFractions(uint256 propertyId, uint256 amount) external payable {
        Property storage property = properties[propertyId];

        // Cannot buy from yourself (the seller)
        if (msg.sender == property.seller) revert InvalidBuyer();

        // Ensure enough fractions are available
        if (amount > property.fractionsForSale) revert NotEnoughFractionsAvailable();

        // Check price
        uint256 totalPrice = property.pricePerFraction * amount;
        if (msg.value != totalPrice) revert IncorrectValueSent();

        // Transfer payment to seller
        payable(property.seller).transfer(msg.value);

        // Transfer the fractions from seller to buyer
        _safeTransferFrom(address(this), msg.sender, propertyId, amount, "");

        // Update the number of available fractions
        property.fractionsForSale -= amount;

        emit FractionsPurchased(propertyId, msg.sender, amount, msg.value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC1155Holder)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
