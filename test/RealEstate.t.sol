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


    

}
