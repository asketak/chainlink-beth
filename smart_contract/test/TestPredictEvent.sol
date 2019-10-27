pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PredictEvent.sol";

contract TestPredictevnt {

  function createContract() returns(Predictevnt res) {
    Predictevnt even = Predictevnt(DeployedAddresses.Predictevnt(
      "How many tweets will @potus tweets till 20.11.2019", 0,
       "https://api.twitter.com/1.1/statuses/user_timeline.json?" , "GET"  , "auth_key=xxx,ticker=gold"
     , "" , "LIMIT=timestamp>3000:results.prizes:count", 1));
      // [(250,260,"250 az 260 tweetu"),(261,270, "261 az 270 tweets")]
   }
  
  function testInitialContractCreation() public {
    Predictevnt evn = createContract();
    Orderbook order;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Order books should be empty");
  }

  function testLimitBuy() public {
    Predictevnt evnt = new Predictevnt();

    uint expected = 10000;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  }

  function testLimitSell() public {
    Predictevnt evnt = new Predictevnt();

    uint expected = 10000;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  }

  function testLimitBuyAndSell() public {
    Predictevnt evnt = new Predictevnt();

    uint expected = 10000;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  }

  function testLimitBuyAndSellSimpleMatch() public {
    Predictevnt evnt = new Predictevnt();

    uint expected = 10000;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  }

  function testLimitBuyAndSellPartialMatch() public {
    Predictevnt evnt = new Predictevnt();

    uint expected = 10000;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  }

  function testLimitBuyAndSellComplexMatch() public {
    Predictevnt evnt = new Predictevnt();

    uint expected = 10000;

    Assert.equal(evnt.getBalance(tx.origin), expected, "Owner should have 10000 Predictevnt initially");
  }
}
