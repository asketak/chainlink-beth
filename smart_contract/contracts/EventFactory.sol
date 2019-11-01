pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./PredictEvent.sol";
import "./Shared.sol";

contract EventFactory {
    struct ContractInfo{
        address add;
        uint timestamp;
    }

    
    mapping(uint => ContractInfo) public allContracts;
    uint allsize;
    Shared.Outcome[] tmp;
    ContractInfo[] ret;
    function createContract ( string[] descriptions, uint _eventResolutionTimestamp, Shared.Outcome[] _possibleOutcomes, bool _outcomeIsString, bool _exactStringMatch ) public {

        Shared.ApiRequest memory _request = Shared.ApiRequest({
            apiPath : descriptions[2],
            httpPostOrGet : descriptions[3],
            getData : descriptions[4],
            postData : descriptions[5],
            jsonRegexString : descriptions[6]
            });
        

        Shared.Event memory market = Shared.Event({
            name : descriptions[0],
            description : descriptions[1],
            eventResolutionTimestamp : _eventResolutionTimestamp,
            request : _request,
            possibleOutcomes : _possibleOutcomes,
            outcomeIsString : _outcomeIsString,
            exactStringMatch : _exactStringMatch
            });

        PredictEvent newContract = new PredictEvent();
        newContract.initialize(market);
        uint m = _eventResolutionTimestamp;
        address a = address(newContract);
        ContractInfo memory c = ContractInfo({
            add: a,
            timestamp : m});

        allContracts[allsize] = c;
        allsize = allsize+1;
        
        address l = 0x20fE562d797A42Dcb3399062AE9546cd06f63280;
        ERC20(l).transfer(a, 3*10**18);
        
    } 
    

    function getAddressCount() public constant returns (uint) {
        return allsize;
    }
    
    function getAllEvents() public constant returns(ContractInfo[]) {
        delete ret;
        for(uint x = 0; x<allsize;x++){
            ret.push(allContracts[x]);
        }
        return ret;
    }

}

contract ERC20 {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}