// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {Charitea} from "../src/Charitea.sol";

contract ChariteaTest is Test {
    event FundCreated(
        uint256 indexed fundIndex,
        address indexed owner,
        string data,
        string worldIdProof
    );
    event FundDonated(
        uint256 indexed fundIndex,
        address indexed donator,
        uint256 amount
    );
    event FundWithdrawn(
        uint256 indexed fundIndex,
        address indexed withdrawer,
        uint256 amount
    );

    Charitea charitea;

    function setUp() public {
        charitea = new Charitea();
    }

    function test_CreateFund() public {
        vm.prank(msg.sender);
        vm.expectEmit(true, true, false, true);
        emit FundCreated(0, msg.sender, "test", "0xproof");
        uint256 fundIndex = charitea.createFund("test", "0xproof");

        (
            address owner,
            uint256 value,
            string memory data,
            string memory worldIdProof
        ) = charitea.funds(fundIndex);

        assertEq(owner, msg.sender);
        assertEq(value, 0);
        assertEq(data, "test");
        assertEq(worldIdProof, "0xproof");
    }

    function test_DonateFund() public {
        uint256 fundIndex = charitea.createFund("test", "0xproof");

        vm.prank(msg.sender);
        vm.expectEmit(true, true, false, true);
        emit FundDonated(fundIndex, msg.sender, 10);
        charitea.donateFund{value: 10}(fundIndex);

        (, uint256 value, , ) = charitea.funds(fundIndex);
        assertEq(value, 10);
    }

    function test_WithdrawFund() public {
        Vm.Wallet memory wallet = vm.createWallet("fundOwner");
        vm.prank(wallet.addr);
        uint256 fundIndex = charitea.createFund("test", "0xproof");
        charitea.donateFund{value: 10}(fundIndex);

        vm.expectRevert(Charitea.UnauthorizedWithdrawal.selector);
        charitea.withdrawFund(fundIndex);

        vm.prank(wallet.addr);
        vm.expectEmit(true, true, false, true);
        emit FundWithdrawn(fundIndex, wallet.addr, 10);
        charitea.withdrawFund(fundIndex);
        (, uint256 value, , ) = charitea.funds(fundIndex);
        assertEq(value, 0);
        assertEq(wallet.addr.balance, 10);
    }
}
