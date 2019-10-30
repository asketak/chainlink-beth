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
    function createContract ( string[] descriptions, uint _marketResolutionTimestamp, Shared.Outcome[] _possibleOutcomes, bool _outcomeIsString ) public {

        Shared.ApiRequest memory _request = Shared.ApiRequest({
            apiPath : descriptions[2],
            httpPostOrGet : descriptions[3],
            getData : descriptions[4],
            postData : descriptions[5],
            jsonRegexString : descriptions[6]
            });
        

        Shared.Market memory market = Shared.Market({
            name : descriptions[0],
            description : descriptions[1],
            marketResolutionTimestamp : _marketResolutionTimestamp,
            request : _request,
            possibleOutcomes : _possibleOutcomes,
            outcomeIsString : _outcomeIsString
            });

        PredictEvent newContract = new PredictEvent();
        newContract.initialize(market);
        uint m = _marketResolutionTimestamp;
        address a = address(newContract);
        ContractInfo memory c = ContractInfo({
            add: a,
            timestamp : m});

        allContracts[allsize] = c;
        allsize = allsize+1;
        
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