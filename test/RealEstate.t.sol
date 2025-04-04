// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {RealEstate} from "../src/RealEstate.sol";

contract CounterTest is Test {
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
}
