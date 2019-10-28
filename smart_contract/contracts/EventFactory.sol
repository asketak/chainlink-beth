pragma experimental ABIEncoderV2;

import "./PredictEvent.sol";
import "./Shared.sol";

contract EventFactory {
    struct ContractInfo{
        address add;
        uint timestamp;
    }
    uint256[] tmp;
    
    ContractInfo[] public allContracts;
    function createContract ( string _name, uint _marketResolutionTimestamp, string _apiPath , string _httpPostOrGet ,
     string _getData , string _postData , string _jsonRegexString ) public {

        Shared.ApiRequest memory _request = Shared.ApiRequest({
            apiPath : _apiPath,
            httpPostOrGet : _httpPostOrGet,
            getData : _getData,
            postData : _postData,
            jsonRegexString : _jsonRegexString
            });

        if(tmp.length <2){
            tmp.push(1);
            tmp.push(2);
        }
        Shared.Market memory market = Shared.Market({
            name : _name,
            marketResolutionTimestamp : _marketResolutionTimestamp,
            request : _request,
            possibleOutcomes : tmp
            });

        PredictEvent newContract = new PredictEvent();
        newContract.initialize(market);

        allContracts.push(ContractInfo({add: newContract,timestamp:_marketResolutionTimestamp}));
    } 

    function getAddressCount() public constant returns (uint) {
        return allContracts.length;
    }

}