//SPDX
import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/BEP20.sol";
import '@pancakeswap/pancake-swap-lib/contracts/math/SafeMath.sol';

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


//SPDX
contract Test{
    using SafeMath for uint256;
    
    uint public a = 1000000000000000;
    uint public b;
    uint public c;
    
    function express() public returns(uint){
        uint z = a.div(9999993);
        b = 1 * (z);
        c = z.mul(9999993);
    }
    
    function mineblock() public {
        
    }
}