// import "./PredictEvent.sol";

// contract EventFactory {
//     mapping(address => uint) public allContracts;

//     function createContract ( string _name, uint _marketResolutionTimestamp, string _apiPath , string _httpPostOrGet ,
//      string _getData , string _postData , string _jsonRegexString, uint[] _possibleOutcomes ) public {
//         address newContract = new PredictEvent(_name,_marketResolutionTimestamp,_apiPath,_httpPostOrGet,
//             _getData,_postData,_jsonRegexString,_possibleOutcomes);
//         allContracts[newContract] = _marketResolutionTimestamp;
//     } 
// }