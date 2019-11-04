# Beth 

Beth backend is designed as two smart contracts.

PredictEvent.sol is a smart contract, representing one event api call to the external API,
This contract stores orderbooks, match orders and pays out winners.

Contract EventFactory.sol deploys newly created PredictEvent.sol smart contracts onto ethereum network an
keeps list of them.

## State of development

The main functionality (creating event, orderbooks, winnings payout) is fully working.
These contracts hovewer still contains a lot of functions available to public that were used to debug,
so don't use it with real money.

## Deployment

For deploying own Beth backend, user simply must deploy EventFactory.sol contract and fund it with some LINK tokens.
