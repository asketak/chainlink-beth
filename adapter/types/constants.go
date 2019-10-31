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
	comparisonRe = regexp.MustCompile("<=|>=|!=|=|>|<")
	isStringRe   = regexp.MustCompile("\"(.*)\"")
)
