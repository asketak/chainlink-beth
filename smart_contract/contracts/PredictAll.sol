pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

/**
* The PredictMarket contract is one market, where people can bet on outcome of some api
*/

contract PredictMarket is ChainlinkClient {

    address public owner 
    modifier only_owner { require(msg.sender == owner); _; }

    // Params for API request to external resource
    struct ApiRequest{
        string apiPath; //"https://api.twitter.com/1.1/statuses/user_timeline.json?";
        string httpPostOrGet; // "GET"
        string getData; // "auth_key=xxx,ticker=gold
        string postData; // { key: value, key2,value}
        string jsonRegexString; // " results.prizes[0].open"
        string resultType; // " "
    }

    // Properties for betting event
    string name;
    uint256 marketResolutionTimestamp;
    ApiRequest request;
    uint result;
    uint[] possibleOutcomes;

    // Orderbook to trade each possible outcome
    struct Order {
        uint amount;
        uint price;
        address owner;
        uint filled;
    }

    mapping (uint => Order) OrderBook;
    OrderBook[] orderbooks;


    constructor( _name, _marketResolutionTimestamp, _apiPath , _httpPostOrGet , _getData
       , _postData , _jsonRegexString, _possibleOutcomes ) public {_
        setPublicChainlinkToken();
        owner = msg.sender;
        name: _name;
        marketResolution_timestamp: _marketResolutionTimestamp;
        possibleOutcomes: _possibleOutcomes;

        request: ApiRequest({
            apiPath : _apiPath,
            httpPostOrGet : _httpPostOrGet,
            getData : _getData,
            postData : _postData,
            jsonRegexString : _jsonRegexString 
            })

        for (uint x = 0; x < possibleOutcomes.length; x++) {
            OrderBook emptyOrderBook
            Orderbooks.push(emptyOrderBook)
        }

    }

    mapping (address => uint) ethBalances;

    function deposit() public payable {ethBalances[msg.sender]+=msg.value;}
    function() public payable {deposit();}

    function withdraw(uint _amount) public {
        require (_amount > ethBalances[msg.sender]);
        ethBalances[msg.sender] -= _amount;
        msg.sender.transfer(amount);
    }

    function order( uint price, uint amount  ) public {
        require (price * amount > ethBalances[msg.sender]);


    }


    // fulfill receives a uint256 data type
    function fulfill(bytes32 _requestId, uint256 _result)
    public
      // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
      recordChainlinkFulfillment(_requestId)
      {
          result = _result;
          update_balances(result) 
      }


      function finalize(address _oracle, bytes32 _jobId, uint256 _payment, string auth_token) 
      public
      onlyOwner
      {

        require (now > market_resolution_timestamp);

    // newRequest takes a JobID, a callback address, and callback function as input
    Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
    // Adds a URL with the key "get" to the request parameters
    req.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
    // Uses input param (dot-delimited string) as the "path" in the request parameters
    req.add("path", "USD");
    // Adds an integer with the key "times" to the request parameters
    req.addInt("times", 100);
    // Sends the request with the amount of payment specified to the oracle
    sendChainlinkRequestTo(_oracle, req, _payment);
}

}



}
