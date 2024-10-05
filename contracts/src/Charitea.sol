// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Charitea {
    struct Fund {
        address owner;
        uint256 value;
        string data;
        string worldIdProof;
    }

    uint256 fundCount;
    Fund[] public funds;

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

    error UnauthorizedWithdrawal();

    function createFund(
        string calldata data,
        string calldata worldIdProof
    ) public returns (uint256 fundIndex) {
        fundIndex = fundCount++;
        funds.push(
            Fund({
                owner: msg.sender,
                value: 0,
                data: data,
                worldIdProof: worldIdProof
            })
        );
        emit FundCreated(fundIndex, msg.sender, data, worldIdProof);
    }

    function donateFund(uint256 fundIndex) public payable {
        funds[fundIndex].value += msg.value;

        emit FundDonated(fundIndex, msg.sender, msg.value);
    }

    function withdrawFund(uint256 fundIndex) public {
        Fund storage fund = funds[fundIndex];

        require(msg.sender == fund.owner, UnauthorizedWithdrawal());

        uint256 toSend = fund.value;
        fund.value = 0;

        payable(fund.owner).transfer(toSend);

        emit FundWithdrawn(fundIndex, fund.owner, toSend);
    }
}
