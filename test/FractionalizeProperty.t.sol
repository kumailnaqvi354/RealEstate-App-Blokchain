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
        alice = address(0x12);
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
        assertEq(fractionalizeProperty.balanceOf(alice, 1), 40);
    }

    /// @notice Test revert if totalFractions is zero
    function testCreateFractionalPropertyZeroFractions() public {
        vm.startPrank(alice);
        vm.expectRevert(abi.encodeWithSignature("ZeroFractions()"));
        fractionalizeProperty.createFractionlizeProperty(0, 0, 1 ether); // Attempt to create with 0 fractions
        vm.stopPrank();
    }

    /// @notice Test revert if sellerOwnedFractions is greater than totalFractions
    function testCreateFractionalPropertySellerOwnershipTooHigh() public {
        vm.startPrank(alice);
        vm.expectRevert(abi.encodeWithSignature("SellerOwnershipTooHigh()")); // Expect revert with the custom error SellerOwnershipTooHigh
        fractionalizeProperty.createFractionlizeProperty(100, 101, 1 ether); // Attempt to assign more seller-owned fractions than total
        vm.stopPrank();
    }

    /// @notice Test that fractionsForSale is calculated correctly
    function testCreateFractionalPropertyFractionsForSale() public {
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        uint256 propertyId = 1;
        (address seller, uint256 totalFractions, uint256 sellerOwnedFractions, uint256 fractionsForSale, uint256 price)
        = fractionalizeProperty.properties(propertyId);
        assertEq(fractionsForSale, totalFractions - sellerOwnedFractions, "fractionsForSale is incorrect");
    }

    function testBuyFractionsSuccess() public {
        // Alice fractionalizes the property
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        (address seller,,,,) = fractionalizeProperty.properties(1);

        // Bob buys 60 fractions (price per = 1 ether)
        vm.startPrank(bob);
        // vm.expectCall(seller, 60 ether); // Expect ether to be sent to seller
        // vm.expectCall(seller, abi.encodeWithSignature("transfer(address,uint256)", bob, 60 ether));
        fractionalizeProperty.buyFractions{value: 60 ether}(1, 60);
        vm.stopPrank();
        (,,, uint256 fractionsForSale,) = fractionalizeProperty.properties(1);

        // Assertions
        assertEq(fractionalizeProperty.balanceOf(bob, 1), 60);
        assertEq(fractionalizeProperty.balanceOf(alice, 1), 40);
        assertEq(fractionsForSale, 0);
    }

    function testBuyFractionsRevertInvalidBuyer() public {
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        vm.startPrank(alice); // alice is the seller
        vm.expectRevert(FractionalProperty.InvalidBuyer.selector);
        fractionalizeProperty.buyFractions{value: 1 ether}(1, 1);
        vm.stopPrank();
    }

    function testBuyFractionsRevertNotEnoughFractionsAvailable() public {
        vm.startPrank(bob); // bob is the buyer
        vm.expectRevert(FractionalProperty.NotEnoughFractionsAvailable.selector);
        fractionalizeProperty.buyFractions{value: 100 ether}(1, 100); // only 60 available
        vm.stopPrank();
    }

    function testBuyFractionsRevertIncorrectValueSent() public {
        uint256 amountToBuy = 10;
        uint256 incorrectValue = 5 ether; // should be 10 ether
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();
        vm.startPrank(bob);
        vm.expectRevert(FractionalProperty.IncorrectValueSent.selector);
        fractionalizeProperty.buyFractions{value: incorrectValue}(1, amountToBuy);
        vm.stopPrank();
    }

    function testResellFractions() public {
        // Create and buy fractions before testing resell
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        vm.startPrank(bob);
        fractionalizeProperty.buyFractions{value: 10 ether}(1, 10);
        vm.stopPrank();

        // Bob resells fractions
        vm.startPrank(bob);
        fractionalizeProperty.resellFractions(1, 5, 2 ether); // resell 5 fractions at 2 ether each
        vm.stopPrank();

        // Verify the resale listing is created
        (
            address seller,
            uint256 totalFractions,
            uint256 sellerOwnedFractions,
            uint256 fractionsForSale,
            uint256 pricePerFraction
        ) = fractionalizeProperty.properties(1);

        assertEq(seller, alice);
        assertEq(totalFractions, 100);
        assertEq(sellerOwnedFractions, 40);
        assertEq(fractionsForSale, 55); // 60 fractions - 10 purchased + 5 resold
    }

    function testResellZeroAmount() public {
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        vm.startPrank(bob);
        fractionalizeProperty.buyFractions{value: 10 ether}(1, 10);
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert(FractionalProperty.ZeroAmount.selector); // Expect ZeroAmount revert
        fractionalizeProperty.resellFractions(1, 0, 2 ether);
        vm.stopPrank();
    }

    function testResellZeroPrice() public {
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        vm.startPrank(bob);
        fractionalizeProperty.buyFractions{value: 10 ether}(1, 10);
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert(FractionalProperty.ZeroPrice.selector); // Expect ZeroPrice revert
        fractionalizeProperty.resellFractions(1, 5, 0);
        vm.stopPrank();
    }

    function testResellInsufficientBalance() public {
        vm.startPrank(alice);
        fractionalizeProperty.createFractionlizeProperty(100, 40, 1 ether);
        vm.stopPrank();

        vm.startPrank(bob);
        fractionalizeProperty.buyFractions{value: 10 ether}(1, 10);
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert(FractionalProperty.InsufficientBalanceToResell.selector); // Expect InsufficientBalanceToResell revert
        fractionalizeProperty.resellFractions(1, 15, 2 ether); // Trying to resell more than owned
        vm.stopPrank();
    }
}
