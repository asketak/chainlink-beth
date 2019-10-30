pragma solidity >=0.4.21 <0.6.0;

// import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";
import "../contracts/PredictEvent.sol";
import "../contracts/EventFactory.sol";

contract TestPredictevnt {

  function createContract()  {
    EventFactory fact = new EventFactory({});
    fact.createContract("name",3000,"apipath","GET","data","postdata","regexstring");
    address zero;
    (address x,uint t )= fact.allContracts(0);
    //require(x > zero, "x is zero");
    require(t > 0, "Timestamp is zero");

    // PredictEvent even = PredictEvent(DeployedAddresses.PredictEvent());
      // "How many tweets will @potus tweets till 20.11.2019", 0,
       // "https://api.twitter.com/1.1/statuses/user_timeline.json?" , "GET"  , "auth_key=xxx,ticker=gold"
     // , "" , "LIMIT=timestamp>3000:results.prizes:count", 1));
      // [(250,260,"250 az 260 tweetu"),(261,270, "261 az 270 tweets")]
   }
  
  // function testInitialContractCreation() public {
  //   Predictevnt evn = createContract();
  //   Orderbook order;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Order books should be empty");
  // }

  // function testLimitBuy() public {
  //   Predictevnt evnt = new Predictevnt();

  //   uint expected = 10000;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  // }

  // function testLimitSell() public {
  //   Predictevnt evnt = new Predictevnt();

  //   uint expected = 10000;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  // }

  // function testLimitBuyAndSell() public {
  //   Predictevnt evnt = new Predictevnt();

  //   uint expected = 10000;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  // }

  // function testLimitBuyAndSellSimpleMatch() public {
  //   Predictevnt evnt = new Predictevnt();

  //   uint expected = 10000;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  // }

  // function testLimitBuyAndSellPartialMatch() public {
  //   Predictevnt evnt = new Predictevnt();

  //   uint expected = 10000;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  // }

  // function testLimitBuyAndSellComplexMatch() public {
  //   Predictevnt evnt = new Predictevnt();

  //   uint expected = 10000;

  //   Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  // }
}
