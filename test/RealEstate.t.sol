// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {RealEstate} from "../src/RealEstate.sol";

contract RealEstateTest is Test {
    RealEstate public realEstate;
    address public alice;
    address public bob;
    address public charlie;
    address public dave;

    function setUp() public {
        alice = address(0x1);
        bob = address(0x2);
        charlie = address(0x3);
        dave = address(0x4);
        vm.deal(alice, 1000 ether);
        vm.deal(bob, 1000 ether);
        vm.deal(charlie, 1000 ether);
        vm.deal(dave, 1000 ether);
        realEstate = new RealEstate();
    }

    function testListProperty() public {
        vm.startPrank(alice);
        realEstate.listProperty("123 Main St", 100 ether, "ipfs://tokenURI", false, 0, 0, 0);
        vm.stopPrank();

        (, string memory location, uint256 price, address owner, bool forSale,,) = realEstate.properties(0);
        assertEq(location, "123 Main St");
        assertEq(price, 100 ether);
        assertEq(owner, alice);
        assertTrue(forSale);
    }

    function testListPropertyWithPaymentPlan() public {
        vm.startPrank(alice);
        realEstate.listProperty("123 Main St", 100 ether, "ipfs://tokenURI", false, 20 ether, 10 ether, 8);
        vm.stopPrank();

        (, string memory location, uint256 price, address owner, bool forSale,,) = realEstate.properties(0);
        assertEq(location, "123 Main St");
        assertEq(price, 100 ether);
        assertEq(owner, alice);
        assertTrue(forSale);
    }

    function testListPropertyWithInvalidPaymentPlan() public {
        vm.startPrank(alice);
        vm.expectRevert(
            abi.encodeWithSignature("InvalidPaymentPlan(uint256,uint256)", 100 ether, 10 * 5 ether + 20 ether)
        );
        realEstate.listProperty("123 Main St", 100 ether, "ipfs://tokenURI", true, 20 ether, 10 ether, 5);
        vm.stopPrank();
    }

    function testPurchaseIndividualProperty() public {
        // Alice lists property
        vm.startPrank(alice);
        realEstate.listProperty("456 Market St", 100 ether, "ipfs://tokenURI", false, 0, 0, 0);
        vm.stopPrank();

        // Bob purchases it with full payment
        vm.prank(bob);
        realEstate.purchaseProperty{value: 100 ether}(0);

        (,,, address newOwner, bool forSale,,) = realEstate.properties(0);
        assertEq(newOwner, bob);
        assertFalse(forSale);
        assertEq(realEstate.ownerOf(0), bob);
    }

    function testPurchaseBuilderPropertyDownPaymentOnly() public {
        // Alice lists as builder
        vm.startPrank(alice);
        realEstate.listProperty("789 Builder Blvd", 100 ether, "ipfs://tokenURI", true, 20 ether, 10 ether, 8);
        vm.stopPrank();

        // Bob pays down payment
        vm.prank(bob);
        realEstate.purchaseProperty{value: 20 ether}(0);

        (,,, address currentOwner, bool forSale,,) = realEstate.properties(0);
        assertEq(currentOwner, alice);
        assertFalse(forSale); // should be reserved

        (address buyer,, uint256 totalPaid,,,) = realEstate.installmentStatus(0);
        assertEq(buyer, bob);
        assertEq(totalPaid, 20 ether);

        // NFT should still be with Alice
        assertEq(realEstate.ownerOf(0), alice);
    }

    function testCannotBuyOwnProperty() public {
        vm.startPrank(alice);
        realEstate.listProperty("Own House", 100 ether, "ipfs://uri", false, 0, 0, 0);
        vm.expectRevert(abi.encodeWithSignature("CannotBuyOwnProperty(address)", alice));
        realEstate.purchaseProperty{value: 100 ether}(0);
        vm.stopPrank();
    }

    function testInsufficientFundsIndividual() public {
        vm.startPrank(alice);
        realEstate.listProperty("Short Street", 100 ether, "ipfs://uri", false, 0, 0, 0);
        vm.stopPrank();

        vm.prank(bob);
        vm.expectRevert(abi.encodeWithSignature("InsufficientFunds(uint256,uint256)", 90 ether, 100 ether));
        realEstate.purchaseProperty{value: 90 ether}(0);
    }

    function testInsufficientDownPayment() public {
        vm.startPrank(alice);
        realEstate.listProperty("Downpayment Rd", 100 ether, "ipfs://uri", true, 25 ether, 5 ether, 15);
        vm.stopPrank();

        vm.prank(bob);
        vm.expectRevert(abi.encodeWithSignature("InsufficientDownPayment(uint256,uint256)", 10 ether, 25 ether));
        realEstate.purchaseProperty{value: 10 ether}(0);
    }

    function testDoubleReservationFails() public {
        // Step 1: Alice lists the property
        vm.startPrank(alice);
        realEstate.listProperty("MultiBuyer Ave", 100 ether, "ipfs://uri", true, 20 ether, 10 ether, 8);
        vm.stopPrank();

        // Step 2: Bob reserves the property
        vm.startPrank(bob);
        realEstate.purchaseProperty{value: 20 ether}(0);

        // Step 3: Charlie tries to reserve the same property (should revert)
        vm.startPrank(charlie);
        vm.expectRevert(abi.encodeWithSignature("PropertyNotForSale(uint256)", 0));
        realEstate.purchaseProperty{value: 20 ether}(0);
        vm.stopPrank();
    }

    function testFullPaymentForBuilderPropertySucceeds() public {
        vm.startPrank(alice);
        realEstate.listProperty("BuilderPayFull Blvd", 100 ether, "ipfs://uri", false, 20 ether, 10 ether, 8);
        vm.stopPrank();

        vm.prank(bob);
        realEstate.purchaseProperty{value: 100 ether}(0); // Paying full, not just down payment

        (,,, address currentOwner, bool forSale,,) = realEstate.properties(0);
        assertEq(currentOwner, bob);
        assertFalse(forSale);
        assertEq(realEstate.ownerOf(0), bob);
    }

    function testCompleteBuilderPlanJourney() public {
        // Step 1: Alice (builder) lists a property with a payment plan
        vm.startPrank(alice);
        realEstate.listProperty("Plan Street", 100 ether, "ipfs://plan-uri", true, 20 ether, 10 ether, 8);
        vm.stopPrank();

        // Step 2: Bob makes the down payment
        vm.prank(bob);
        realEstate.purchaseProperty{value: 20 ether}(0);

        // Check reservation and ownership (still with builder)
        (,,, address currOwner, bool forSale,,) = realEstate.properties(0);
        assertEq(currOwner, alice);
        assertFalse(forSale);
        assertEq(realEstate.ownerOf(0), alice);

        // Step 3: Bob pays all 8 installments
        for (uint256 i = 0; i < 8; i++) {
            vm.prank(bob);
            realEstate.payInstallment{value: 10 ether}(0);

            (address buyer, uint256 paidInstallments, uint256 totalPaid,,,) = realEstate.installmentStatus(0);
            assertEq(buyer, bob);
            assertEq(paidInstallments, i + 1);
            assertEq(totalPaid, 20 ether + (10 ether * (i + 1)));
        }

        // Step 4: Check ownership after final installment
        assertEq(realEstate.ownerOf(0), bob);

        // Verify updated property state
        (,,, address newOwner, bool isForSale,,) = realEstate.properties(0);
        assertEq(newOwner, bob);
        assertFalse(isForSale);
    }
}
