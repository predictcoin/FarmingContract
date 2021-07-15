// SPDX-License-Identifier: Unlicensed
pragma solidity 0.6.12;

import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/IBEP20.sol";

// SyrupBar with Governance.
contract MasterPredWallet {
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
            pred.transfer(_to, predBal);
            return predBal;
        } else {
            pred.transfer(_to, _amount);
            return _amount;
        }
    }
}