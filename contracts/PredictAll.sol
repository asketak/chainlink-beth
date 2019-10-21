pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}

/**
 * The PredictMarket contract is one market, where people can bet on outcome of some api
 */
contract PredictMarket {
	string public name = "How many tweets wil @potus post between 30.10 and 7.11";
	string public api_path = "How many tweets wil @potus post between 30.10 and 7.11";
	string public http_post_or_get = "GET";
	string public post_data = "{  auth: PREDICTOR_AUTH_TOKEN}";
	string public auth_token = "";
	uint256 public market_finalize_after = 0;

  	constructor(string _auth_token_hash) public {
  		auth_token_hash = _auth_token_hash

 	}

  	function finalize ( string auth_token) public {

  	
  }
  


}
