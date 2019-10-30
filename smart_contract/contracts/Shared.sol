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
    }
    

    // Properties for betting event
    struct Market {
        string name;
        uint256 marketResolutionTimestamp;
        ApiRequest request;
        Outcome[] possibleOutcomes;
    }

    function bytesToUint(bytes b) public returns (uint256){
        uint256 number;
        for(uint i=0;i<b.length;i++){
            number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
        }
        return number;
    }
}