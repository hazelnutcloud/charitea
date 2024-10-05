// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Charitea {
    struct Fund {
        address owner;
        uint value;
        string data;
    }

    uint fundCount;
    Fund[] public funds;

    event FundCreated(
        uint indexed fundIndex,
        address indexed owner,
        string data
    );
    event FundDonated(
        uint indexed fundIndex,
        address indexed donator,
        uint amount
    );
    event FundWithdrawn(
        uint indexed fundIndex,
        address indexed withdrawer,
        uint amount
    );

    error UnauthorizedWithdrawal();

    function createFund(string calldata data) public returns (uint fundIndex) {
        fundIndex = fundCount++;
        funds.push(Fund({owner: msg.sender, value: 0, data: data}));
        emit FundCreated(fundIndex, msg.sender, data);
    }

    function donateFund(uint fundIndex) public payable {
        funds[fundIndex].value += msg.value;

        emit FundDonated(fundIndex, msg.sender, msg.value);
    }

    function withdrawFund(uint fundIndex) public {
        Fund storage fund = funds[fundIndex];

        require(msg.sender == fund.owner, UnauthorizedWithdrawal());

        uint toSend = fund.value;
        fund.value = 0;

        payable(fund.owner).transfer(toSend);

        emit FundWithdrawn(fundIndex, fund.owner, toSend);
    }
}
