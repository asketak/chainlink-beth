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