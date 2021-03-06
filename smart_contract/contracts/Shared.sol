pragma solidity 0.4.24;

library Shared { 
    struct ApiRequest{
        string apiPath; //"https://api.twitter.com/1.1/statuses/user_timeline.json?";
        string httpPostOrGet; // "GET"
        string getData; // "auth_key=xxx,ticker=gold
        string postData; // { key: value, key2,value}
        string jsonRegexString; // " results.prizes[0].open"
    }

    struct Outcome {
        string name;
        uint maxValue;
        uint minValue;
        string strValue;
    }


    // Properties for betting event
    struct Event {
        string name;
        string description;
        uint256 eventResolutionTimestamp;
        ApiRequest request;
        Outcome[] possibleOutcomes;
        bool outcomeIsString;
        bool exactStringMatch;
    }

    function bytesToUint(bytes b) public returns (uint256){
        uint256 number;
        for(uint i=0;i<b.length;i++){
            number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
        }
        return number;
    }
}