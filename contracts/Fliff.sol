pragma solidity ^0.5.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Fliff
{ 
    //borrowers end up with a negative global balance
    //loanders will have a positive global balance

      mapping (address => int) public globalBalance;
      IERC20 public stableCoin;

      event DebtAdded(
          address indexed _debtor,
          address indexed _debtee,
          int _amount
      );

      event DebtSettled(
          address indexed _debtor,
          address indexed _debtee,
          int _amount
      );

      constructor(IERC20 _stableCoin) public
      {
          stableCoin = _stableCoin;
      }

      function recordDebt(int amount, address recipient) public {
          stableCoin.approve(msg.sender, uint(amount));
          globalBalance[msg.sender] -= amount;
          globalBalance[recipient] += amount;
          emit DebtAdded(msg.sender, recipient, amount);
      }

      function getGlobalBalance(address person) public view returns (int) {
          return globalBalance[person];
      }

      function debtSettled(int amount, address recipient) public {
          stableCoin.transferFrom(msg.sender, recipient, uint(amount));

          globalBalance[msg.sender] += amount;
          globalBalance[recipient] -= amount;

          emit DebtSettled(msg.sender, recipient, amount);
      }

      
}