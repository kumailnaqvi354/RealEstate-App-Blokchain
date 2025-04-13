// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalProperty is ERC1155, Ownable {
    uint256 public currentPropertyId;

    struct Property {
        address seller;
        uint256 totalFractions;
        uint256 sellerOwnedFractions;
        uint256 fractionsForSale;
        uint256 pricePerFraction; // in wei
    }

    mapping(uint256 => Property) public properties;

        constructor(string memory uri) ERC1155(uri) Ownable(msg.sender){}
}