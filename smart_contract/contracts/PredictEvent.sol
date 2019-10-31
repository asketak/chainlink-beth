pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "chainlink/contracts/ChainlinkClient.sol";
import "./Shared.sol";

/**
* The PredictEvent contract is one Event, where people can bet on outcome of some api
*/

contract PredictEvent is ChainlinkClient {

    // Orderbook to trade each possible outcome
    struct Order {
        uint amount;
        uint price;
        address owner;
        uint filled;
        bool isBuy;
        uint marketID;
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
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;
    event logs(string agg,uint a);
    event lord(
        uint amount,
        uint price,
        address owner,
        uint filled,
        bool isBuy,
        uint marketID
        );

    function showOrder (uint a,uint b, uint c, bool isBuy) constant public returns(Order res) {
        if(isBuy){
            return Orderbooks[a][b].BuyOrdersQueue[c];
            }else{
                return Orderbooks[a][b].SellOrdersQueue[c];
            }
        }


        function getOutcomes () constant public returns(Shared.Outcome[] res) {
            return Event.possibleOutcomes;
        }



    // Event result -> price of asset -> orderbooklevel
    mapping(uint => mapping(uint => OrderbookLevel)) public Orderbooks;
    uint[] public highest_limit_buy;
    uint[] public lowest_limit_sell;
    Shared.Event public Event;
    uint public eventFinalResult;
    uint public result;
    bool public finalized;
    bool public initialized;
    mapping (address => uint) public toPay;
    address[] public addressesToPay;
    mapping (address => uint) public deposited;
    address[] public depositedA;
    address constant public oracleAdd = 0xbd8524180968A12dcBE5C881E21DDAbd1Ba7F4a1;

    bool locked;
    uint maximumBumberOfOrders; // to prevent stalling contract
    bytes32 CHAINLINKERRORCONST = bytes32("CHAINLING NODE ERROR"); // magical value, returned by adapter when error occurs
    
    uint constant weekInSeconds = 7*24*3600;
    address finalizer;
    
    constructor() public {
              setChainlinkToken(0x20fe562d797a42dcb3399062ae9546cd06f63280);
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


    function computeLimits (uint _EventID) constant returns(uint buy, uint sell)  {
        buy = 0;
        sell = 100;
        for(uint x =0; x<100;x++){
            if(Orderbooks[_EventID][x].unffilledBuys > 0){
                buy = x;
            }
            if(Orderbooks[_EventID][99-x].unffilledSells > 0){
                sell = 99-x;
            }

        }
        return (buy,sell);
    }
    

    function placeOrder( uint _price, uint _amount, bool _isBuy, uint _EventID  ) public payable {
        require (_price > 0 && _price < 100);
        require (_EventID < Event.possibleOutcomes.length && _EventID >=0 );
        require (_amount > 0);
        if(_isBuy){
            require (msg.value > _price * _amount);
            }else{
                require (msg.value > (100 - _price) * _amount);

            }

            (highest_limit_buy[_EventID], lowest_limit_sell[_EventID]) =  computeLimits(_EventID);
            if (_isBuy){
                emit logs("BUY ORDER",0);
                placeBuyOrder(_price,_amount,msg.sender,_EventID);
            }
            else{
                emit logs("SELL ORDER",0);
                placeSellOrder(_price,_amount,msg.sender,_EventID);
            }
            (highest_limit_buy[_EventID], lowest_limit_sell[_EventID]) =  computeLimits(_EventID);

            if(deposited[msg.sender] == 0){
                depositedA.push(msg.sender);
            }
            deposited[msg.sender] += msg.value*9/10;  
        }

        function placeBuyOrder( uint _price, uint _amount, address _owner, uint result) internal {
        if (_price < lowest_limit_sell[result]) { // Limit buy order
            emit logs("BUY LIMIT ORDER",0);
            Order memory order = Order({
                amount : _amount,
                price : _price,
                owner : _owner,
                marketID : result,
                isBuy : true,
                filled : 0
                });
            Orderbooks[result][_price].BuyOrdersQueue.push(order);
            Orderbooks[result][_price].unffilledBuys +=_amount;
            emit lord(_amount,_price,_owner,0,true,result);


        }

        else{ // Event order, will fill some limit sell orders
            emit logs("BUY Event ORDER",0);
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
                    price : matchprice,
                    isBuy : true,
                    filled : filledThisLevel,
                    marketID : result
                    });
                emit lord(filledThisLevel,matchprice,_owner,filledThisLevel,true,result);
                Orderbooks[result][matchprice].BuyOrdersQueue.push(order);
                Orderbooks[result][matchprice].unfilledBuyOrdersPointer++; 
                Orderbooks[result][matchprice].unffilledSells -=filledThisLevel;
                if ( remaining_amount > 0 && matchprice == _price ){ // we will go for another level, just insert filled order here
                    order = Order({
                        amount : remaining_amount,
                        marketID : result,
                        owner : _owner,
                        price : matchprice,
                        isBuy : true,
                        filled : 0
                        });
                emit lord(remaining_amount,matchprice,_owner,0,true,result);
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
                price : _price,
                    marketID : result,
                filled : 0
                });
            Orderbooks[result][_price].SellOrdersQueue.push(order);
            Orderbooks[result][_price].unffilledSells +=_amount;
            emit lord(_amount,_price,_owner,0,false,result);

        }

        else{ // Event order, will fill some limit buy orders
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
                    price : matchprice,
                    marketID : result,
                    isBuy : false,
                    filled : filledThisLevel
                    });
                emit lord(filledThisLevel,matchprice,_owner,filledThisLevel,false,result);
                Orderbooks[result][matchprice].SellOrdersQueue.push(order);
                Orderbooks[result][matchprice].unfilledSellOrdersPointer++; 
                Orderbooks[result][matchprice].unffilledBuys -=filledThisLevel;

                // we compute how much we filled and append filled order into sellorders.
                // There could be multiple filled sell orders from the past
                if ( remaining_amount > 0 && matchprice == _price ){ // we will go for another level, just insert filled order here
                    order = Order({
                        amount : remaining_amount,
                        owner : _owner,
                        price : matchprice,
                        isBuy : false,
                    marketID : result,
                        filled : 0
                        });
                emit lord(remaining_amount,matchprice,_owner,0,false,result);
                    Orderbooks[result][matchprice].SellOrdersQueue.push(order);
                    Orderbooks[result][matchprice].unffilledSells +=remaining_amount;

                }
            }
        }

    }

    function initialize (Shared.Event _Event ) public {
        // require (!initialized);
        initialized = true;
        setPublicChainlinkToken;

        Event.name = _Event.name;
        Event.eventResolutionTimestamp = _Event.eventResolutionTimestamp;
        Event.request = _Event.request;
        Event.description = _Event.description;


        // Event = _Event;
        for (uint x = 0; x < _Event.possibleOutcomes.length; x++) {
            highest_limit_buy.push(0);
            lowest_limit_sell.push(100);
            Event.possibleOutcomes.push(_Event.possibleOutcomes[x]);

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
        require (now > Event.eventResolutionTimestamp);
        // require (!finalized);


        finalizer = msg.sender;
        // if (now > Event.eventResolutionTimestamp + weekInSeconds // week passed after end of Event
        // && !finalized){  // and not finalized
        //     doInvalidTransactions();
        //     emit logs("invalidated",0);
        //     finalized = true;
        //     return;
        // }
        getChainlinkResult(auth_token);
    }



    function getChainlinkResult (string auth_token) public {
        bytes32 jobId = 0x3334303639626438646463363439356438326165623437663631633261326336;
        Shared.ApiRequest storage r = Event.request;
        // newRequest takes a JobID, a callback address, and callback function as input
        
        Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);
        req.add("apiPath", r.apiPath);
        req.add("httpPostOrGet", r.httpPostOrGet);
        if(bytes(r.getData).length>0){
            req.add("getData", r.getData);
        }
        if(bytes(r.postData).length >0){
            req.add("postData", r.postData);
        }
        req.add("jsonRegexString", r.jsonRegexString);
        req.add("auth_token", auth_token);
        req.add("copyPath", "data");
        // req.addInt("times",1000);


        sendChainlinkRequestTo(oracleAdd, req, ORACLE_PAYMENT);
    }
    
  //     function createRequestTo(
  //   address _oracle,
  //   bytes32 _jobId,
  //   uint256 _payment,
  //   string _url,
  //   string _path,
  //   int256 _times
  // )
  //   public
  //   returns (bytes32 requestId)
  // {
  //   Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
  //   req.add("url", _url);
  //   req.add("path", _path);
  //   req.addInt("times", _times);
  //   requestId = sendChainlinkRequestTo(_oracle, req, _payment);
  // }

    function fulfill(bytes32 _requestId, uint256 _result)
    public
    // Use recordChainlinkFulfillment to ensure only the requesting oracle can fulfill
    recordChainlinkFulfillment(_requestId)
    {
        eventFinalResult = _result;
        // if(CHAINLINKERRORCONST == _result){ // magic constant, means error from api
        //     emit InvalidChainlinkRequest(finalizer);
        //     return;
        // }
        // result = Shared.bytesToUint(abi.encodePacked(_result));
        // eventFinalResult = result_to_index(_result); // eventFinalResult is index of Event, that won
        // if (eventFinalResult != 2**256-1){
        //     computeWinners();
        //     sendEtherToWinners();
        // }
    }

    function sendEtherToWinners ()  internal returns(bool res) {
        require (!finalized);
        finalized = true;
        
        for(uint x=0; x<addressesToPay.length;x++){
            address add = addressesToPay[x];
            string memory z = toString(add);
            uint amount = toPay[add];
            emit logs("Paying",amount);
            emit logs(z,amount);
            require(add.send(amount));
        }
        return true; // to trigger noReentry
    }
    


    function substring (string memory what, string memory where)
    internal returns(bool res) {
     bytes memory whatBytes = bytes (what);
     bytes memory whereBytes = bytes (where);

     bool found = false;
     for (uint i = 0; i < whereBytes.length - whatBytes.length; i++) {
        bool flag = true;
        for (uint j = 0; j < whatBytes.length; j++)
        if (whereBytes [i + j] != whatBytes [j]) {
            flag = false;
            break;
        }
        if (flag) {
            found = true;
            break;
        }
    }    
    }

function bytes32ToStr(bytes32 _bytes32) public pure returns (string) {

    // string memory str = string(_bytes32);
    // TypeError: Explicit type conversion not allowed from "bytes32" to "string storage pointer"
    // thus we should fist convert bytes32 to bytes (to dynamically-sized byte array)

    bytes memory bytesArray = new bytes(32);
    for (uint256 i; i < 32; i++) {
        bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
}


function result_to_index (bytes32 _result) internal returns(uint ret) {
    string memory sResult = bytes32ToStr(_result);
    uint uResult = uint(_result);


    for(uint x=0;x<Event.possibleOutcomes.length;x++){ // all price levels
        Shared.Outcome storage outcome = Event.possibleOutcomes[x];
        if(Event.outcomeIsString){
            if(Event.exactStringMatch && keccak256(outcome.strValue) == keccak256(sResult) ){
                return x;
            }
            if(!Event.exactStringMatch && substring( outcome.strValue, sResult)){
                return x;
            }
            }else{
                if(outcome.minValue <= uResult && outcome.maxValue >= uResult){
                    return x;
                }
            }
        }

        return 2**255-1;
    }



    function computeWinners () internal returns(bool res)  {
        require (!finalized);
        Order[] memory queue;

        for(uint outcome=0;outcome<Event.possibleOutcomes.length;outcome++){ 
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



    function toString(address x) returns (string) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }

    function doInvalidTransactions ()  internal returns(bool res) {
        require (!finalized);
        finalized = true;
        
        for(uint x=0; x<depositedA.length;x++){
            address add = depositedA[x];
            string memory z = toString(add);
            uint amount = deposited[add];
            emit logs("PLATIM",amount);
            emit logs(z,amount);
            require(add.send(amount));
        }
        return true; // to trigger noReentry
    } 

    

}




