package types

type ApiRequest struct {
	ApiPath             string                 `json:"apiPath"`
	HttpPostOrGet       string                 `json:"httpPostOrGet"`
	GetData             string                 `json:"getData"`
	PostData            map[string]interface{} `json:"postData"`
	JsonRegexString     string                 `json:"jsonRegexString"`
	EncryptedAPIAuthKey string                 `json:"encryptedAPIAuthKey"`
}
