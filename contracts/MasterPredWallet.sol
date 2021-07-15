// SPDX-License-Identifier: Unlicensed
pragma solidity 0.6.12;

import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/IBEP20.sol";
import '@pancakeswap/pancake-swap-lib/contracts/token/BEP20/SafeBEP20.sol';

// SyrupBar with Governance.
contract MasterPredWallet {
    using SafeBEP20 for IBEP20;
    // The PRED TOKEN!
    IBEP20 public pred;
    address public owner;

    constructor(
        IBEP20 _pred
    ) public {
        pred = _pred;
        owner = msg.sender;
    }

    // Safe pred transfer function, just in case if rounding error causes pool to not have enough PREDs.
    function safePredTransfer(address _to, uint256 _amount) public returns(uint) {
        require(msg.sender == owner, "Wallet: Only MasterPred can transfer");
        uint256 predBal = pred.balanceOf(address(this));
        if (_amount > predBal) {
            pred.safeTransfer(_to, predBal);
            return predBal;
        } else {
            pred.safeTransfer(_to, _amount);
            return _amount;
        }
    }
}