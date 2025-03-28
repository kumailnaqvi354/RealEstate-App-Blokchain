// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.29;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract RealEtate is ERC721, Ownable {
    uint256 public propertyId;

    struct PropertyDetail {
        string name;
        string location;
        uint256 area;
        uint256 price;
        bool isBuilderProperty;
        uint256 noOfInstallments;
        uint256 installmentAmount;
    }

    mapping(uint256 => PropertyDetail) public propertyDetails;

    constructor() ERC721("RealEstate", "RE") Ownable(msg.sender) {}

    function listProperty(
        string memory name,
        string memory location,
        uint256 area,
        uint256 price,
        bool isBuilderProperty,
        uint256 noOfInstallments,
        uint256 installmentAmount
    ) external {
        unchecked {
            propertyId++;
        }
        
    }
}
