pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "chainlink/contracts/ChainlinkClient.sol";
import "./Shared.sol";

/**
* The PredictEvent contract is one market, where people can bet on outcome of some api
*/

contract PredictEvent is ChainlinkClient {

    // Orderbook to trade each possible outcome
    struct Order {
        uint amount;
        address owner;
        uint filled;
        bool isBuy;
    }

    // Que of all orders at that level
    struct OrderbookLevel{
        Order[] BuyOrdersQueue;
        uint unfilledBuyOrdersPointer;
        uint unffilledBuys;
        Order[] SellOrdersQueue;
        uint unfilledSellOrdersPointer;
        uint unffilledSells;

        uint sellLen;
        uint buyLen;
    }

    event logs(string agg,uint a);
    event lord(Order agg);

    function showOrder (uint a,uint b, uint c, bool isBuy) constant public returns(Order res) {
        if(isBuy){
            return Orderbooks[a][b].BuyOrdersQueue[c];
        }else{
            return Orderbooks[a][b].SellOrdersQueue[c];
        }
    }
    
    
    function getOutcomes () constant public returns(Shared.Outcome[] res) {
        return market.possibleOutcomes;
    }
    

    
    // market result -> price of asset -> orderbooklevel
    mapping(uint => mapping(uint => OrderbookLevel)) public Orderbooks;
    uint[] public highest_limit_buy;
    uint[] public lowest_limit_sell;
    Shared.Market public market;
    uint public eventFinalResult;
    bool public finalized;
    bool public initialized;
    mapping (address => uint) toPay;
    bool locked;
    uint maximumBumberOfOrders; // to prevent stalling contract
    bytes32 CHAINLINKERRORCONST = bytes32("CHAINLING NODE ERROR"); // magical value, returned by adapter when error occurs
    
    uint constant weekInSeconds = 7*24*3600;
    address finalizer;
    address[] addressesToPay;
    
    constructor() public {
    }
    
    function showBooks() constant returns(uint[100][2][10] res) {
        for(uint a =0; a<10;a++){
            for(uint x =0; x<100;x++){
                res[a][0][x] = Orderbooks[a][x].unffilledBuys;
                res[a][1][x] = Orderbooks[a][x].unffilledSells;
            }
        }
        return res;
    }

    function showBook(uint a) constant returns(uint[100][2][10] res) {
        for(uint x =0; x<100;x++){
            res[a][0][x] = Orderbooks[a][x].unffilledBuys;
            res[a][1][x] = Orderbooks[a][x].unffilledSells;
        }
        return res;
    }


    function computeLimits (uint _marketID) constant returns(uint buy, uint sell)  {
        buy = 0;
        sell = 100;
        for(uint x =0; x<100;x++){
            if(Orderbooks[_marketID][x].unffilledBuys > 0){
                buy = x;
            }
            if(Orderbooks[_marketID][99-x].unffilledSells > 0){
                sell = 99-x;
            }

        }
        return (buy,sell);
    }
    

    function placeOrder( uint _price, uint _amount, bool _isBuy, uint _marketID  ) public payable {
        require (_price > 0 && _price < 100);
        require (_marketID < market.possibleOutcomes.length && _marketID >=0 );
        require (_amount > 0);
        require (msg.value > _price * _amount);

        (highest_limit_buy[_marketID], lowest_limit_sell[_marketID]) =  computeLimits(_marketID);
        if (_isBuy){
            emit logs("BUY ORDER",0);
            placeBuyOrder(_price,_amount,msg.sender,_marketID);
        }
        else{
            emit logs("SELL ORDER",0);
            placeSellOrder(_price,_amount,msg.sender,_marketID);
        }
        (highest_limit_buy[_marketID], lowest_limit_sell[_marketID]) =  computeLimits(_marketID);
    }

    function placeBuyOrder( uint _price, uint _amount, address _owner, uint result) internal {
        if (_price < lowest_limit_sell[result]) { // Limit buy order
            emit logs("BUY LIMIT ORDER",0);
            Order memory order = Order({
                amount : _amount,
                owner : _owner,
                isBuy : true,
                filled : 0
                });
            Orderbooks[result][_price].BuyOrdersQueue.push(order);
            Orderbooks[result][_price].unffilledBuys +=_amount;
            emit lord(order);


        }

        else{ // Market order, will fill some limit sell orders
            emit logs("BUY market ORDER",0);
            uint remaining_amount = _amount;
            uint matchprice = lowest_limit_sell[result];
            for (; remaining_amount >0 && matchprice <= _price; matchprice++ ){ // we go from best price to higher price
                emit logs("If for cycle, price:" , matchprice);
                uint filledThisLevel = 0;
                uint priceLevelOrderCount = Orderbooks[result][matchprice].SellOrdersQueue.length;
                uint unfilledSellOrdersPointer = Orderbooks[result][matchprice].unfilledSellOrdersPointer;
                emit logs("ordercount " , priceLevelOrderCount);
                emit logs("unfilpointer " , unfilledSellOrdersPointer);

                // for one price, we iterate through all sell orders of that price 
                for (uint i=unfilledSellOrdersPointer; i<priceLevelOrderCount && remaining_amount > 0; i++) {
                    Order storage sellOrder = Orderbooks[result][matchprice].SellOrdersQueue[i];
                    // Our order is bigger that limit order, we fill it
                    if (remaining_amount >= sellOrder.amount - sellOrder.filled){
                        remaining_amount -= (sellOrder.amount - sellOrder.filled); // my remaining amount to fill
                        Orderbooks[result][matchprice].unfilledSellOrdersPointer++; // move pointer
                        filledThisLevel += (sellOrder.amount - sellOrder.filled); // amount we filled on this level
                        sellOrder.filled = sellOrder.amount; // fill sell order
                    }
                    else{ // we can just partially fill the order
                        // Orderbooks[result][matchprice].unfilledSellOrdersPointer++; order is not filled
                        sellOrder.filled += remaining_amount;
                        filledThisLevel += remaining_amount;
                        remaining_amount = 0;
                    }
                }

                order = Order({
                    amount : filledThisLevel,
                    owner : _owner,
                    isBuy : true,
                    filled : filledThisLevel
                    });
                emit lord(order);
                Orderbooks[result][matchprice].BuyOrdersQueue.push(order);
                Orderbooks[result][matchprice].unfilledBuyOrdersPointer++; 
                Orderbooks[result][matchprice].unffilledSells -=filledThisLevel;
                if ( remaining_amount > 0 && matchprice == _price ){ // we will go for another level, just insert filled order here
                    order = Order({
                        amount : remaining_amount,
                        owner : _owner,
                        isBuy : true,
                        filled : 0
                        });
                    emit lord(order);
                    Orderbooks[result][matchprice].BuyOrdersQueue.push(order);
                    Orderbooks[result][matchprice].unffilledBuys +=remaining_amount;

                }
            }
        }
    }

    function placeSellOrder( uint _price, uint _amount, address _owner, uint result) internal {
        if (_price > highest_limit_buy[result]) { // Limit sell order
            emit logs("SELL LIMIT ORDER",0);
            Order memory order = Order({
                amount : _amount,
                owner : _owner,
                isBuy : false,
                filled : 0
                });
            emit lord(order);
            Orderbooks[result][_price].SellOrdersQueue.push(order);
            Orderbooks[result][_price].unffilledSells +=_amount;

        }

        else{ // Market order, will fill some limit buy orders
            uint remaining_amount = _amount;
            uint matchprice = highest_limit_buy[result];
            for (; remaining_amount >0 && matchprice >= _price; matchprice-- ){ // we go from best price to higher price
                uint filledThisLevel = 0;
                uint priceLevelOrderCount = Orderbooks[result][matchprice].BuyOrdersQueue.length;
                uint unfilledBuyOrdersPointer = Orderbooks[result][matchprice].unfilledBuyOrdersPointer;

                // for one price, we iterate through all sell orders of that price 
                for (uint i=unfilledBuyOrdersPointer; i<priceLevelOrderCount && remaining_amount > 0; i++) {
                    Order storage buyOrder = Orderbooks[result][matchprice].BuyOrdersQueue[i];
                    // Our order is bigger that limit order, we fill it
                    if (remaining_amount >= buyOrder.amount - buyOrder.filled){
                        remaining_amount -= (buyOrder.amount - buyOrder.filled); // my remaining amount to fill
                        Orderbooks[result][matchprice].unfilledBuyOrdersPointer++; // move pointer
                        filledThisLevel += (buyOrder.amount - buyOrder.filled); // amount we filled on this level
                        buyOrder.filled = buyOrder.amount; // fill sell order
                    }
                    else{ // we can just partially fill the order
                        // Orderbooks[result][matchprice].unfilledbuyOrdersPointer++; order is not filled
                        buyOrder.filled += remaining_amount;
                        filledThisLevel += remaining_amount;
                        remaining_amount = 0;
                    }
                }

                order = Order({
                    amount : filledThisLevel,
                    owner : _owner,
                    isBuy : false,
                    filled : filledThisLevel
                    });
                emit lord(order);
                Orderbooks[result][matchprice].SellOrdersQueue.push(order);
                Orderbooks[result][matchprice].unfilledSellOrdersPointer++; 
                Orderbooks[result][matchprice].unffilledBuys -=filledThisLevel;

                // we compute how much we filled and append filled order into sellorders.
                // There could be multiple filled sell orders from the past
                if ( remaining_amount > 0 && matchprice == _price ){ // we will go for another level, just insert filled order here
                    order = Order({
                        amount : remaining_amount,
                        owner : _owner,
                        isBuy : false,
                        filled : 0
                        });
                    emit lord(order);
                    Orderbooks[result][matchprice].SellOrdersQueue.push(order);
                    Orderbooks[result][matchprice].unffilledSells +=remaining_amount;

                }
            }
        }

    }

    function initialize (Shared.Market _market ) public {
        // require (!initialized);
        initialized = true;
        setPublicChainlinkToken;

        market.name = _market.name;
        market.marketResolutionTimestamp = _market.marketResolutionTimestamp;
        market.request = _market.request;


        // market = _market;
        for (uint x = 0; x < _market.possibleOutcomes.length; x++) {
            highest_limit_buy.push(0);
            lowest_limit_sell.push(100);
            market.possibleOutcomes.push(_market.possibleOutcomes[x]);

        }
    }


    event InvalidChainlinkRequest(address finalizer);
    address public last_finalizer;

    modifier noReentrancy() {
        require(
            !locked,
            "Reentrant call."
            );
        locked = true;
        _;
        locked = false;
    }

    
    function finalize(string auth_token) public noReentrancy {
        require (now > market.marketResolutionTimestamp);
        require (!finalized);

        finalizer = msg.sender;
        if (now > market.marketResolutionTimestamp + weekInSeconds // week passed after end of market
        && !finalized){  // and not finalized
            closeInvalidMarket(); 
            doTransactions();
            finalized = true;
            return;
        }
        getChainlinkResult(auth_token);
    }


    function closeInvalidMarket () internal returns(bool res) {
        require (!finalized);
        
        for(uint outcome=0;outcome<market.possibleOutcomes.length;outcome++){ // x = possible outcome
            for(uint price=0;price<100;price++){ // all price levels
                for(uint z=0;z<Orderbooks[outcome][price].BuyOrdersQueue.length;z++){
                    address owner = Orderbooks[outcome][price].BuyOrdersQueue[z].owner;
                    uint amount =Orderbooks[outcome][price].BuyOrdersQueue[z].filled*price;
                    if(toPay[owner] == 0){
                        addressesToPay.push(owner);
                    }
                    toPay[owner]+=amount;
                }

                for(z=0;z<Orderbooks[outcome][price].SellOrdersQueue.length;z++){
                    owner = Orderbooks[outcome][price].BuyOrdersQueue[z].owner;
                    amount = Orderbooks[outcome][price].BuyOrdersQueue[z].filled*(100-price);
                    if(toPay[owner] == 0){
                        addressesToPay.push(owner);
                    }
                    toPay[owner]+=amount;
                }
            }
        }

        return true; // to trigger noReentrty
    }


    function getChainlinkResult (string auth_token) internal {
        bytes32 jobId;
        address oracle;
        Shared.ApiRequest storage r = market.request;
        // newRequest takes a JobID, a callback address, and callback function as input
        
        Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);
        req.add("apiPath", r.apiPath);
        req.add("httpPostOrGet", r.httpPostOrGet);
        req.add("getData", r.getData);
        req.add("postData", r.postData);
        req.add("jsonRegexString", r.jsonRegexString);
        req.add("auth_token", auth_token);

        sendChainlinkRequestTo(oracle, req, 1);
    }

    function fulfill(bytes32 _requestId, bytes32 _result)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
    {
        if(CHAINLINKERRORCONST == _result){ // magic constant, means error from api
            emit InvalidChainlinkRequest(finalizer);
            return;
        }
        uint result = Shared.bytesToUint(abi.encodePacked(_result));
        eventFinalResult = result_to_index(result); // eventFinalResult is index of market, that won
        computeWinners();
        doTransactions();
    }

    function result_to_index (uint result) internal returns(uint res) {
        return 0;
    }
    
    

    function computeWinners () internal returns(bool res)  {
        require (!finalized);
        

        Order[] memory queue;

        for(uint outcome=0;outcome<market.possibleOutcomes.length;outcome++){ 
            for(uint price=0;price<100;price++){ // all price levels
                ( outcome == eventFinalResult)? queue = Orderbooks[outcome][price].BuyOrdersQueue : queue = Orderbooks[outcome][price].SellOrdersQueue;
                for(uint z=0;z<queue.length;z++){
                    address owner = queue[z].owner;
                    uint amount = queue[z].filled*100;
                    if(toPay[owner] == 0){
                        addressesToPay.push(owner);
                    }
                    toPay[owner]+=amount;
                }
            }
        }
    }

    function doTransactions ()  internal noReentrancy returns(bool res) {
        require (!finalized);
        finalized = true;
        
        for(uint x=0; x<addressesToPay.length;x++){
            address add = addressesToPay[x];
            uint amount = toPay[add];
            require(add.send(amount));
        }
        return true; // to trigger noReentry
    } 

    

}




