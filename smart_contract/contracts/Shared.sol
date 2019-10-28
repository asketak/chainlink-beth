library Shared { 
    struct ApiRequest{
        string apiPath; //"https://api.twitter.com/1.1/statuses/user_timeline.json?";
        string httpPostOrGet; // "GET"
        string getData; // "auth_key=xxx,ticker=gold
        string postData; // { key: value, key2,value}
        string jsonRegexString; // " results.prizes[0].open"
    }

    // Properties for betting event
    struct Market {
        string name;
        uint256 marketResolutionTimestamp;
        ApiRequest request;
        uint[] possibleOutcomes;
    }
}