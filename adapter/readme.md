This is our universal chainlink node adapter. It accepts request in this json format:


```
{
    "data": {
        "httpPostOrGet": "GET",
        "apiPath": "https://api.twitter.com/1.1/statuses/user_timeline.json",
        "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV",
        "getData": "screen_name=paul",
        "jsonRegexString": "0.entities.urls:length"
    }
}
```

The adapter sends http POST or GET request to given apiPath using data in getData or postData variable.

It then parses returned json using jsonRegexString.
When a key to access api is needed, adapter accepts key encrypted via his public key,
 decrypts that key and replace 'API_KEY_REPLACE' with decrypted key.

We did not finish a page, where users can encrypt their keys, so this functionality is commented out
and adapter now accepts keys in simple plaintext form.

Adapter can count the length of list from returned json and can filter list items by some value, like:
```
results.tweets:author="@realDonaldTrump":length
```
should give number of tweets in the list, where value of author is "@realDonaldTrump"

Adapter also can authenticate to the API via oauth2 bearer token. This is now hardcoded just for twitter api.

##WARNING
The keys in this repo are for demonstrational purposes,
DON't use them for anything in production, generate your own keys!

```
openssl genrsa -out privkey.pem 2048
openssl rsa -in privkey.pem -pubout -out pubkey.pem
```

## Some usage examples

The adapter can be started locally via 
```
go run server.go
```


### Getting price of BTC in dollars

```
curl -H "Content-Type: application/json" -X POST http://localhost:8080/ -d ' 
{
    "data": {
        "httpPostOrGet": "GET",
        "apiPath": "http://api.coinlayer.com/api/live",
        "encryptedAPIAuthKey": "b9c0805af0f0021247d19ee64959c01c",
        "getData": "access_key=API_KEY_REPLACE&symbols=BTC,ETH",
        "jsonRegexString": "rates.BTC"
    }
}'
```

### Getting number of tweets from @LINKNewsOracle since tweet https://twitter.com/OVioHQ/status/1189509255528886272

```
curl -H "Content-Type: application/json" -X POST http://localhost:8080/ -d '  
{
  "data": { 
    "httpPostOrGet": "GET", 
    "apiPath": "https://api.twitter.com/1.1/statuses/user_timeline.json", 
    "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV", 
    "getData": "screen_name=LINKNewsOracle&since_id=1189509255528886272", 
    "jsonRegexString": ":length" } 
} '
```

### Number of followers of @officialmcafee have at time of finalisation.

```
curl  -H "Content-Type: application/json" -X POST http://localhost:8080/-d ' 
{
 "data": {
    "httpPostOrGet": "GET",
    "apiPath": "https://api.twitter.com/1.1/users/show.json",
    "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV",
    "getData": "screen_name=officialmcafee",
    "jsonRegexString": "followers_count"
      }
} '
```

### Getting the temperature in Moscow.

```
curl -H "Content-Type: application/json" -X POST http://localhost:8080/ -d '
{
    "data": {
        "httpPostOrGet": "GET",
        "apiPath": "http://api.openweathermap.org/data/2.5/forecast",
        "encryptedAPIAuthKey": "4ace388a74eb900cc092f7ddae61aba7",
        "getData": "id=524901&APPID=API_KEY_REPLACE",
        "jsonRegexString": "list.0.main.temp"
    }
}'
```

## Stuff in progress:
- Getting boolean if given substring exist in returned value from api.
- Automatic keypair generation and UI for encrypting API keys.