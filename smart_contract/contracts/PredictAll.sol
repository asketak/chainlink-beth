pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

/**
* The PredictMarket contract is one market, where people can bet on outcome of some api
*/

contract PredictMarket is ChainlinkClient {

	address public owner 
	modifier only_owner { require(msg.sender == owner); _; }

 	// Params for API request
 	struct ApiRequest{
 		string api_path ;
 		string http_post_or_get ;
 		string get_data ;
 		string post_data ;
 		string json_regex_string ;
 	}

 	struct Market{
 		string name ;
 		uint256 market_resolution_timestamp ;
 		ApiRequest request;
 	}

 	Market public market;

 	// api_path = "https://api.twitter.com/1.1/statuses/user_timeline.json?";
 	// http_post_or_get = "GET";
 	// get_data = "screen_name=potus";
 	// post_data = "{  key: 'value', key2: 'value'}";
 	// json_regex_string = ""
 	// name = "How many tweets wil @potus post between 30.10 and 7.11";
 	// market_resolution_timestamp = 0;

 	constructor( _name, _market_resolution_timestamp, _api_path , _http_post_or_get , _get_data , _post_data , _json_regex_string ) public {_
 		setPublicChainlinkToken();
 		owner = msg.sender;
 		market = Market({ 
 			name: _name,
 			market_resolution_timestamp: _market_resolution_timestamp,
 			request: ApiRequest({
 				api_path : _api_path,
 				http_post_or_get : _http_post_or_get,
 				get_data : _get_data,
 				post_data : _post_data,
 				json_regex_string : _json_regex_string 
 				})
 			});
 	}

 	mapping (address => uint) balances;
 	function deposit() public payable {balances[msg.sender]+=msg.value;}

 	struct Order {
 		uint amount;
 		uint price;
 		address owner;
 		uint filled;
 	}

 	struct OrderBookLevel {

 	}

 	function order( int price, int amount  ) public {
 		require ();
 	}

 	// fulfill receives a uint256 data type
 	function fulfill(bytes32 _requestId, uint256 _price)
 	  public
 	  // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
 	  recordChainlinkFulfillment(_requestId)
 	{
 	  currentPrice = _price;
 	}

 	function finalize ( string auth_token) public {

 	}



 }
