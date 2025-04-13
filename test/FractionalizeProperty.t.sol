// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {FractionalProperty} from "../src/FractionalizeProperty.sol";

contract RealEstateTest is Test {
    FractionalProperty public fractionalizeProperty;
    address public alice;
    address public bob;
    address public charlie;
    address public dave;
    address public admin;

    function setUp() public {
        alice = address(0x1);
        bob = address(0x2);
        charlie = address(0x3);
        dave = address(0x4);
        admin = address(0x5);
        vm.deal(alice, 1000 ether);
        vm.deal(bob, 1000 ether);
        vm.deal(charlie, 1000 ether);
        vm.deal(dave, 1000 ether);
        vm.startPrank(admin);
        fractionalizeProperty = new FractionalProperty("https://example.com/metadata/");
        vm.stopPrank();
    }

      /// @notice Test successful creation
    function testCreateFractionalPropertySuccess() public {
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        (address seller,, uint256 sellerOwned,, uint256 price) = fractionalizeProperty.properties(1);
        assertEq(seller, alice);
        assertEq(sellerOwned, 40);
        assertEq(price, 1 ether);
        assertEq(fractionalizeProperty.balanceOf(alice, 1), 100);
        assertEq(fractionalizeProperty.isApprovedForAll(alice, address(fractionalizeProperty)), true);
    }


}