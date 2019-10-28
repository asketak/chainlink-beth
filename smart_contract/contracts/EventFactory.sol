import "./PredictEvent.sol";

contract EventFactory {
    address[] public allContracts;

    function createContract (bytes32 name) {
        address newContract = new PredictEvent(name);
        newContracts.push(newContract);
    } 

    function getActiveContracts () {
        address[] public ret;
        for(uint x = 0; x<allContracts.length; x++){
            if (allContracts[x].){

                marketResolutionTimestamp
                ret.push(newContract);
            }
        }
    } 

}