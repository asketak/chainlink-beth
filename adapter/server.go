package main

import (
	"adapter/types"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"github.com/linkpoolio/bridges"
	"io/ioutil"
	"net/url"
	"reflect"
	"strings"
)

type Api struct {
	privKey *rsa.PrivateKey
}

// Opts is the bridge.Bridge implementation
func (cc *Api) Opts() *bridges.Opts {
	return &bridges.Opts{
		Name:   "Api",
		Lambda: true,
	}
}

// Run is the bridge.Bridge Run implementation that returns the price response
func (cc *Api) Run(h *bridges.Helper) (interface{}, error) {
	parsed := types.ApiRequest{}

	raw, err := h.Data.MarshalJSON()
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(raw, &parsed)
	if err != nil {
		return nil, err
	}

	var result interface{}

	parsedApiUrl, _ := url.Parse(parsed.ApiPath)

	var decryptedAuthKey string
	if parsed.EncryptedAPIAuthKey != "" {
		//decryptedAuthKeyBytes, _ := cc.privateDecrypt([]byte(parsed.EncryptedAPIAuthKey))
		//decryptedAuthKey = string(decryptedAuthKeyBytes)
	}

	decryptedAuthKey = parsed.EncryptedAPIAuthKey

	switch parsedApiUrl.Host {
	case "api.twitter.com":
		err = h.HTTPCallWithOpts(
			parsed.HttpPostOrGet,
			parsed.ApiPath+"?"+parsed.GetData,
			&result,
			bridges.CallOpts{
				Auth: bridges.NewAuth(bridges.AuthHeader, "Authorization", "Bearer "+decryptedAuthKey),
			},
		)
	default:
		if parsed.GetData != "" {
			parsed.ApiPath += "?" + strings.Replace(parsed.GetData, types.ApiKeyReplace, decryptedAuthKey, -1)
		}
		if parsed.PostData != nil {
			for key, value := range parsed.PostData {
				if value == types.ApiKeyReplace {
					parsed.PostData[key] = decryptedAuthKey
					break
				}
			}
		}

		if parsed.PostData == nil {
			// in case of empty post data we should use HTTPCAll which wont parse the response
			var bytes []byte
			bytes, err = h.HTTPCallRawWithOpts(
				parsed.HttpPostOrGet,
				parsed.ApiPath,
				bridges.CallOpts{
					Query: parsed.PostData,
				},
			)
			if err == nil && strings.Contains(string(bytes), "{") {
				err = json.Unmarshal(bytes, &result)
			} else if err == nil {
				result = string(bytes)
			}
		} else {
			err = h.HTTPCallWithOpts(
				parsed.HttpPostOrGet,
				parsed.ApiPath,
				&result,
				bridges.CallOpts{
					Query: parsed.PostData,
				},
			)
		}
	}

	if err != nil {
		fmt.Println(err)
	}

	out := make(map[string]interface{})

	if parsed.JsonRegexString != "" {
		funcSplit := strings.Split(parsed.JsonRegexString, ":")
		selectors := funcSplit[0]
		funcs := strings.Join(funcSplit[1:], ":")
		out["data"] = types.ParseFuncs(types.ParseJsonPath(result, selectors), funcs)
	} else {
		out["data"] = result
	}

	if out["data"] != nil {
		rt := reflect.TypeOf(out["data"])
		switch rt.Kind() {
		case reflect.Int64, reflect.Int32, reflect.Int:
			out["data"] = fmt.Sprintf("%d", out["data"])
		case reflect.Float32, reflect.Float64:
			out["data"] = fmt.Sprintf("%f", out["data"])
			if strings.Contains(out["data"].(string), ".") && !types.NonZeroRe.MatchString(out["data"].(string)) {
				parts := strings.Split(out["data"].(string), ".")
				out["data"] = parts[0]
			}
		}
	}
	return out, nil
}

// will encrypt bytes with public key
func (a *Api) publicEncrypt(data []byte) ([]byte, error) {
	return rsa.EncryptPKCS1v15(rand.Reader, &a.privKey.PublicKey, data)
}

// will decrypt bytes using private key - without keystring/password
func (a *Api) privateDecrypt(data []byte) ([]byte, error) {
	return rsa.DecryptPKCS1v15(rand.Reader, a.privKey, data)
}

// prepares private/public keys
func rsaConfigSetup(rsaPrivateKeyLocation, rsaPublicKeyLocation string) (*rsa.PrivateKey, error) {
	priv, err := ioutil.ReadFile(rsaPrivateKeyLocation)
	if err != nil {
		return nil, errors.New("no RSA private key found")
	}

	privPem, _ := pem.Decode(priv)
	var parsedKey interface{}
	if parsedKey, err = x509.ParsePKCS1PrivateKey(privPem.Bytes); err != nil {
		if parsedKey, err = x509.ParsePKCS8PrivateKey(privPem.Bytes); err != nil { // note this returns type `interface{}`
			return nil, errors.New("unable to parse RSA private key")
		}
	}

	var privateKey *rsa.PrivateKey
	var ok bool
	privateKey, ok = parsedKey.(*rsa.PrivateKey)
	if !ok {
		return nil, errors.New("unable to parse RSA private key")
	}

	pub, err := ioutil.ReadFile(rsaPublicKeyLocation)
	if err != nil {
		return nil, errors.New("no RSA public key found")
	}

	pubPem, _ := pem.Decode(pub)
	if parsedKey, err = x509.ParsePKIXPublicKey(pubPem.Bytes); err != nil {
		return nil, errors.New("unable to parse RSA public key")
	}

	var pubKey *rsa.PublicKey
	if pubKey, ok = parsedKey.(*rsa.PublicKey); !ok {
		return nil, errors.New("unable to parse RSA public key")
	}

	privateKey.PublicKey = *pubKey

	return privateKey, nil
}

func main() {
	privKey, err := rsaConfigSetup("privkey.pem", "pubkey.pem")
	if err != nil {
		panic(err)
	}

	bridges.NewServer(&Api{privKey}).Start(8080)
}
