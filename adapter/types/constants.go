package types

import "regexp"

const (
	ApiKeyReplace = "API_KEY_REPLACE"
	FuncLength    = "length"
	OperatorGte   = ">="
	OperatorGt    = ">"
	OperatorLte   = "<="
	OperatorLt    = "<"
	OperatorNeq   = "!="
	OperatorEq    = "="
)

var (
	ComparisonRe = regexp.MustCompile(`<=|>=|!=|=|>|<`)
	IsStringRe   = regexp.MustCompile(`"(.*)"`)
	NonZeroRe    = regexp.MustCompile(`\.0*[1-9]`)
)
