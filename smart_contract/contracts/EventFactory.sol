import "./PredictEvent.sol";
import "./Shared.sol";

contract EventFactory {
    mapping(address => uint) public allContracts;

    function createContract ( string _name, uint _marketResolutionTimestamp, string _apiPath , string _httpPostOrGet ,
       string _getData , string _postData , string _jsonRegexString, uint[] _possibleOutcomes ) public {

        Shared.ApiRequest memory _request = Shared.ApiRequest({
            apiPath : _apiPath,
            httpPostOrGet : _httpPostOrGet,
            getData : _getData,
            postData : _postData,
            jsonRegexStringa : _jsonRegexString
            });

        Shared.Market memory market = Shared.Market({
            name : _name,
            marketResolutionTimestamp : _marketResolutionTimestamp,
            request : _request,
            possibleOutcomes : _possibleOutcomes
            });

        address newContract = new PredictEvent();
        PredictEvent con = PredictEvent(newContract);
        con.initialize(market);
        allContracts[newContract] = _marketResolutionTimestamp;
    } 
}