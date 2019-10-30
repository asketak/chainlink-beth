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
    function createContract ( string _name, uint _marketResolutionTimestamp, string _apiPath , string _httpPostOrGet ,
       string _getData , string _postData , string _jsonRegexString) public {

        Shared.ApiRequest memory _request = Shared.ApiRequest({
            apiPath : _apiPath,
            httpPostOrGet : _httpPostOrGet,
            getData : _getData,
            postData : _postData,
            jsonRegexString : _jsonRegexString
            });

        if(tmp.length <2){


            Shared.Outcome memory ord = Shared.Outcome({
                name:"",
                minValue:0,
                maxValue:4
                });
            tmp.push(ord);
            tmp.push(ord);
        }
        

        Shared.Market memory market = Shared.Market({
            name : _name,
            marketResolutionTimestamp : _marketResolutionTimestamp,
            request : _request,
            possibleOutcomes : tmp
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
        return allContracts;
    }

}
}