openssl genrsa -out privkey.pem 2048
openssl rsa -in privkey.pem -pubout -out pubkey.pem

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


coinlayer
=================================================
http://api.coinlayer.com/api/live?access_key=b9c0805af0f0021247d19ee64959c01c&symbols=BTC,ETH

{
    "data": {
        "httpPostOrGet": "GET",
        "apiPath": "http://api.coinlayer.com/api/live",
        "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV",
        "getData": "access_key=b9c0805af0f0021247d19ee64959c01c&symbols=BTC,ETH"
        "jsonRegexString": "rates.BTC"
    }
}

=================================================
tweets

How many tweets from LINKNewsOracle since tweet
https://twitter.com/OVioHQ/status/1189509255528886272

curl -d ' { "data": { "httpPostOrGet": "GET", "apiPath": "https://api.twitter.com/1.1/statuses/user_timeline.json", "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV", "getData": "screen_name=LINKNewsOracle&since_id=1189509255528886272", "jsonRegexString": ":length" } } ' -H "Content-Type: application/json" -X POST http://localhost:8080/ 

How many followers does officialmcafee have at time of finalisation

curl -d ' { "data": { "httpPostOrGet": "GET", "apiPath": "https://api.twitter.com/1.1/users/show.json", "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV", "getData": "screen_name=officialmcafee", "jsonRegexString": "followers_count" } } ' -H "Content-Type: application/json" -X POST http://localhost:8080/


=======================================================

zatim nefunguje
wolfram alpha

https://api.wolframalpha.com/v2/query?input=president+of+usa+now&format=plaintext&output=JSON&appid=88J6HQ-96W9K8V5J3

curl -H "Content-Type: application/json" -X POST http://localhost:8080/ -d ' { "data": { "httpPostOrGet": "GET", "apiPath": "http://api.wolframalpha.com/v1/result?", "encryptedAPIAuthKey": "88J6HQ-96W9K8V5J3", "getData": "appid=API_KEY_REPLACE&i=How+far+is+Los+Angeles+from+New+York%3f&output=JSON", "jsonRegexString": "" } }



88J6HQ-96W9K8V5J3

curl -H "Content-Type: application/json" -X POST http://localhost:8080/ -d ' 
  {
    "data": {
        "httpPostOrGet": "GET",
        "apiPath": "https://api.wolframalpha.com/v2/query",
        "encryptedAPIAuthKey": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFwZUV5alRLZ01nVHFtTU5OYjZTeQpBT0lsQ1h3amYyZytLMk9BcmRxZGgwZHJ4RTdSOUJYam1jUE44cUE4bk9pVXE3VVErblcwSW81dGljOERQaFk3CkVxL25Qd2JWSXdOT1Q1a0tpUkZNYWU4SWZqYUV4YmkyYTVRS3NjUFlkalo0NGo3OU1RUDNudkN6djdEaUdHWW4KZnN6YVZYRGo1blZJSGxicVY5Wi9EQnZZQUNJNTVGZlBiNXNlb1NtL3FpVStvRzlCb21QM0NNS3FqdWFob2dMYQpRd3VsNG1IS1dtZWZNR1dLeVJhSjB3S2ZLK1AxT2dhMkxJclBVeFpMMndhZXJ1cHgveTZVcVlQcFg4ODAxMHdhCmhoZ3VIZGFDbUMxclJTRGZ6VXVtb25PM3M3V3ZZNmlkTVZmME5BRzR2eTJaRUZ3UlVSVVVWZ2VvUCtsQXl4ZDcKeXdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
        "getData": "input=president+of+usa+now&format=plaintext&output=JSON&appid=88J6HQ-96W9K8V5J3",
        "jsonRegexString": "pods.1.subpods.plaintext"
    }
}'


=======================================
openweatchermap


tohle vraci moscow, klic neencryptnut
curl -H "Content-Type: application/json" -X POST http://localhost:8080/ -d '
{
    "data": {
        "httpPostOrGet": "GET",
        "apiPath": "http://api.openweathermap.org/data/2.5/forecast",
        "encryptedAPIAuthKey": "AAAAAAAAAAAAAAAAAAAAAIDcuwAAAAAAMmY%2F%2FRzoxtN%2FTRMWUNaZFs0emNA%3DMGPWccKRN9kt3HMCOuuaDDfFhgp2pZo9mUB3G48uLCqLrVycpV",
        "getData": "id=524901&APPID=4ace388a74eb900cc092f7ddae61aba7",
        "jsonRegexString": "city.name.gagarin"
    }
}'
http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=4ace388a74eb900cc092f7ddae61aba7