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

    event PropertyFractionalized(
        uint256 indexed propertyId,
        address indexed seller,
        uint256 totalFractions,
        uint256 sellerOwnedFractions,
        uint256 fractionsForSale,
        uint256 pricePerFraction
    );

    constructor(string memory uri) ERC1155(uri) Ownable(msg.sender) {}

    /// @notice Mint and list fractions of a property
    function createFractionlizeProperty(uint256 totalFractions, uint256 sellerOwnedFractions, uint256 pricePerFraction)
        external
    {
        if (totalFractions == 0) revert ZeroFractions();
        if (sellerOwnedFractions > totalFractions) revert SellerOwnershipTooHigh();

        uint256 fractionsForSale = totalFractions - sellerOwnedFractions;
        uint256 propertyId = ++currentPropertyId;

        // Mint all to contract
        _mint(msg.sender, propertyId, totalFractions, "");
        setApprovalForAll(address(this), true);

        properties[propertyId] = Property({
            seller: msg.sender,
            totalFractions: totalFractions,
            sellerOwnedFractions: sellerOwnedFractions,
            fractionsForSale: fractionsForSale,
            pricePerFraction: pricePerFraction
        });
        emit PropertyFractionalized(
            propertyId,
            msg.sender,
            totalFractions,
            sellerOwnedFractions,
            fractionsForSale,
            pricePerFraction
        );
    }



    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
