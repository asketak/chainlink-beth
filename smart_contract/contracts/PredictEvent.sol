pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
* The PredictEvent contract is one market, where people can bet on outcome of some api
*/

contract PredictEvent is ChainlinkClient {

    // Params for API request to external resource
    struct ApiRequest{
        string apiPath; //"https://api.twitter.com/1.1/statuses/user_timeline.json?";
        string httpPostOrGet; // "GET"
        string getData; // "auth_key=xxx,ticker=gold
        string postData; // { key: value, key2,value}
        string jsonRegexString; // " results.prizes[0].open"
    }

    // Properties for betting event
    string name;
    uint256 public marketResolutionTimestamp;
    ApiRequest request;
    uint result;
    uint[] possibleOutcomes;


    // Orderbook to trade each possible outcome
    struct Order {
        uint amount;
        // uint price;
        address owner;
        uint filled;
        bool isBuy;
    }

    // Que of all orders at that level
    struct OrderbookLevel{
        Order[] BuyOrdersQueue;
        uint unfilledBuyOrdersPointer;
        Order[] SellOrdersQueue;
        uint unfilledSellOrdersPointer;
    }

    // market result -> price of asset -> orderbooklevel
    mapping(uint => mapping(uint => OrderbookLevel)) Orderbooks;
    uint[] highest_limit_buy;
    uint[] lowest_limit_sell;

    function placeBuyOrder( uint _price, uint _amount, address _owner) public {
        // require(_price*_amount > ethBalances[_owner]);
        // ethBalances[_owner] =- _price * _amount ;

        Order memory order = Order({
            amount : _amount,
            owner : _owner,
            isBuy : true,
            filled : 0
            });

        mapping(uint => OrderbookLevel) book = Orderbooks[result];

        if (_price < lowest_limit_sell[result]) { // Limit buy order
            Orderbooks[result][_price].BuyOrdersQueue.push(order);
            if (_price > highest_limit_buy[result]){
                highest_limit_buy[result] = _price;
            }

        }

        else{ // Market order, will fill some limit sell orders
            uint remaining_amount = _amount;
            uint matchprice = lowest_limit_sell[result];
            for (; remaining_amount >0 && matchprice <= _price; matchprice++ ){ // we go from best price to higher price
                uint filledThisLevel = 0;
                uint priceLevelOrderCount = Orderbooks[result][matchprice].SellOrdersQueue.length;
                uint unfilledSellOrdersPointer = Orderbooks[result][matchprice].unfilledSellOrdersPointer;

                // for one price, we iterate through all sell orders of that price 
                for (uint i=unfilledSellOrdersPointer; i<priceLevelOrderCount && remaining_amount > 0; i++) {
                    Order sellOrder = Orderbooks[result][matchprice].SellOrdersQueue[i];
                    // Our order is bigger that limit order, we fill it
                    if (remaining_amount >= sellOrder.amount - sellOrder.filled){
                        remaining_amount -= (sellOrder.amount - sellOrder.filled);
                        Orderbooks[result][matchprice].unfilledSellOrdersPointer++;
                        Orderbooks[result][matchprice].SellOrdersQueue[i].filled = Orderbooks[result][matchprice].SellOrdersQueue[i].amount;
                        filledThisLevel += (sellOrder.amount - sellOrder.filled);
                    }
                    else{ // we can just partially fill the order
                        Orderbooks[result][matchprice].SellOrdersQueue[i].filled += remaining_amount;
                        remaining_amount = 0;
                        filledThisLevel += remaining_amount;
                        // Orderbooks[result][matchprice].unfilledSellOrdersPointer++; order is not filled
                    }
                }

                // we compute how much we filled and append filled order into buyordersQue.
                // There could be multiple filled buy orders from the past
                if ( remaining_amount > 0 && matchprice < _price ){ // we will go for another level, just insert filled order here
                    order = Order({
                        amount : filledThisLevel,
                        owner : _owner,
                        isBuy : true,
                        filled : filledThisLevel
                        });
                    Orderbooks[result][matchprice].BuyOrdersQueue.push(order);
                    Orderbooks[result][matchprice].unfilledBuyOrdersPointer++; 
                }else{ // This is the last iteration of for, update pointers

                    // No more sell orders on this level, create new limit order buy and update pointers
                    if(priceLevelOrderCount == unfilledSellOrdersPointer){
                        order = Order({
                            amount : filledThisLevel,
                            owner : _owner,
                            isBuy : true,
                            filled : filledThisLevel
                            });
                        Orderbooks[result][matchprice].BuyOrdersQueue.push(order);
                        Orderbooks[result][matchprice].unfilledBuyOrdersPointer++; 

                        order = Order({
                            amount : remaining_amount,
                            owner : _owner,
                            isBuy : true,
                            filled : 0
                            });
                        Orderbooks[result][matchprice].BuyOrdersQueue.push(order);

                        highest_limit_buy[result] = matchprice;
                        lowest_limit_sell[result] = matchprice+1;

                    // There are still unfilled sell orders at match price = this order got filled
                    }else{
                        order = Order({
                            amount : filledThisLevel,
                            owner : _owner,
                            isBuy : true,
                            filled : filledThisLevel
                            });
                        Orderbooks[result][matchprice].BuyOrdersQueue.push(order);
                        highest_limit_buy[result] = matchprice-1;
                        lowest_limit_sell[result] = matchprice;
                        Orderbooks[result][matchprice].unfilledBuyOrdersPointer++; 
                    }
                }
            }
        }

    }

    function placeSellOrder( uint _price, uint _amount, address _owner) public {
    }

    constructor(string _name, uint _marketResolutionTimestamp, string _apiPath , string _httpPostOrGet , string _getData
     , string _postData , string _jsonRegexString, uint[] _possibleOutcomes ) public {
        setPublicChainlinkToken;
        address owner = msg.sender;
        name= _name;
        uint marketResolution_timestamp= _marketResolutionTimestamp;
        possibleOutcomes= _possibleOutcomes;

        ApiRequest memory request= ApiRequest({
            apiPath : _apiPath,
            httpPostOrGet : _httpPostOrGet,
            getData : _getData,
            postData : _postData,
            jsonRegexString : _jsonRegexString 
            });
        for (uint x = 0; x < possibleOutcomes.length; x++) {
            highest_limit_buy[x] = 0;
            lowest_limit_sell[x] = 100;
        }
    }

    function placeOrder( uint _price, uint _amount, bool _isBuy, uint result  ) public {
        require (_price > 0 && _price < 100);

        if (_isBuy){
            placeBuyOrder(_price,_amount,msg.sender);
        }
        else{
            placeSellOrder(_price,_amount,msg.sender);
        }
    }


    // fulfill receives a uint256 data type
    function fulfill(bytes32 _requestId, uint256 _result)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
    {
        result = _result;
        // update_balances(result);
    }

    function finalize(address _oracle, bytes32 _jobId, uint256 _payment, string auth_token) 
    public
    {
        require (now > marketResolutionTimestamp);

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




