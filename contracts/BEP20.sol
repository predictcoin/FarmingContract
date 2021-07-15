//SPDX
import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/BEP20.sol";

contract LPToken1 is BEP20("BUSDPRED","BUSDPRED"){
    constructor() public{
        _mint(msg.sender, 10000000);
    }
}

contract LPToken2 is BEP20("BNBPRED","BNBPRED"){
    constructor() public{
        _mint(msg.sender, 10000000);
    }
}