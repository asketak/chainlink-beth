# Beth 

Beth is a tool for creating prediction markets.
Market creators can create a market where users can bet on outcome of specific API call.

The creator of market specify:
- API endpoint 
- Parameters to be posted to the API with the request
- Timestamp, when the request can be sent and market ends.
- Possible outcomes. These are represented as numerical ranges.

The users can buy and sell of specific outcome. The price per share is between 1-99 mETH.
If the result of the API call falls into the range of some outcome, that all buyers earn 100 mETH per share.
If the result is the API call is something else, then all short sellers earn 100 mETH .

Beth is deployed on ropsten network with frontend on <http://beth.network>

## State of the project

This project is currently deployed on ropsten network.
Hovewer, it's lacking security features, data aggregation and input validation in current version.
UI is functional, but could show more information like the amount of winnnings/losses of the user.
The core functionality, creating markets, adding orders to orderbooks, matching of orders and payouts work as expected.
We plan to address these issues in future versions.

## Market lifecycle

Markets can be created on <https://beth-network.herokuapp.com/create-event>

The parameters of market are:

- Name and description
- End Date - this is timestamp, after when u will be able to close the market and payout the winners.
- Api Path - path to the API enpoint
- POST or GET - string "POST" or "GET" indicating used method in the HTTP request
- Post Params and Get Params - Post params is stringified json, get params is just a string to append after Api Path. If it contains string "API_KEY_REPLACE", than this string will be replaced with provided api key during market finalization.
- Json Regex - this is string, that describes which part of json response should be used to decide the winning outcome.
- Ranges of outcomes - these are possible outcomes. If the returned value is in the range, then the market pays buyers, else it pays sellers.

Users can bet on different outcomes of the market till the End Date.
After that, anyone can finalize market, providing his api key for the endpoint.
Prediction market waits till someone succesfully finalize market.
If that does not happen for a week after End Date, market is considered invalid and pays back users the amount they invested.

## Here are some examples of different markets:

### Getting price of BTC in dollars
-     "httpPostOrGet": "GET",
-     "apiPath": "http://api.coinlayer.com/api/live",
-     "getData": "access_key=API_KEY_REPLACE&symbols=BTC,ETH",
-     "jsonRegexString": "rates.BTC"

### Getting number of tweets from @LINKNewsOracle since tweet https://twitter.com/OVioHQ/status/1189509255528886272

-     "httpPostOrGet": "GET", 
-     "apiPath": "https://api.twitter.com/1.1/statuses/user_timeline.json", 
-     "getData": "screen_name=LINKNewsOracle&since_id=1189509255528886272", 
-     "jsonRegexString": ":length" 

### Number of followers of @officialmcafee have at time of finalisation.

-     "httpPostOrGet": "GET",
-     "apiPath": "https://api.twitter.com/1.1/users/show.json",
-     "getData": "screen_name=officialmcafee",
-     "jsonRegexString": "followers_count"

### Getting the temperature in Moscow.

-     "httpPostOrGet": "GET",
-     "apiPath": "http://api.openweathermap.org/data/2.5/forecast",
-     "getData": "id=524901&APPID=API_KEY_REPLACE",
-     "jsonRegexString": "list.0.main.temp"

## Finalization of market

After the date of market finalization, user can submit their API key. That api key will replace API_KEY_REPLACE
string in postData and getData or be used as Oauth2 bearer token when calling twitter api.
If market doesn't get inalize properly during 168 hours after finalization time, the market will
return to all users the amount of ETH they bet.
