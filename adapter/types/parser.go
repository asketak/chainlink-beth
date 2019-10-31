package types

import (
	"reflect"
	"strconv"
	"strings"
)

// will use remaining interface and will try to apply function calls or comparisons on it
func ParseFuncs(in interface{}, funcsPath string) interface{} {
	if funcsPath == "" || in == nil {
		return in
	}
	selectors := strings.Split(funcsPath, ":")
	if len(selectors) == 0 {
		return in
	}

	var step interface{}

	first := selectors[0]
	remaining := strings.Join(selectors[1:], ":")

	comparisons := ComparisonRe.FindAllString(first, -1)
	isComparison := len(comparisons) == 1
	if len(comparisons) > 1 {
		return step
	}

	rt := reflect.TypeOf(in)
	switch rt.Kind() {
	case reflect.Array, reflect.Slice:
		if isComparison {
			return step
		}
		step = callArrayFunc(in.([]interface{}), first)
	default:
		if !isComparison {
			return step
		}
		step = callComparissonFunc(in.(map[string]interface{}), first, comparisons[0])
	}

	return ParseFuncs(step, remaining)
}

// supplies comparison rules
func callComparissonFunc(in map[string]interface{}, comparison string, operator string) bool {
	operands := strings.Split(comparison, operator)
	if len(operands) != 2 {
		return false
	}

	mapValue := in[operands[0]]
	if mapValue == nil {
		return false
	}
	var comparedString string
	var comparedFloat float64
	var isNumber bool

	if submatchStrings := IsStringRe.FindStringSubmatch(operands[1]); len(submatchStrings) == 0 {
		var err error
		comparedFloat, err = strconv.ParseFloat(operands[1], 64)
		if err != nil {
			return false
		}
		isNumber = true
	} else if len(submatchStrings) == 2 {
		comparedString = submatchStrings[1]
	} else {
		return false
	}

	switch operator {
	case OperatorGte:
		if isNumber {
			return mapValue.(float64) >= comparedFloat
		}
	case OperatorGt:
		if isNumber {
			return mapValue.(float64) > comparedFloat
		}
	case OperatorLte:
		if isNumber {
			return mapValue.(float64) <= comparedFloat
		}
	case OperatorLt:
		if isNumber {
			return mapValue.(float64) < comparedFloat
		}
	case OperatorNeq:
		if isNumber {
			return mapValue.(float64) != comparedFloat
		}
		return mapValue.(string) != comparedString
	case OperatorEq:
		if isNumber {
			return mapValue.(float64) == comparedFloat
		}
		return mapValue.(string) == comparedString
	default:
		return false
	}
	return false
}

// supplies function call
func callArrayFunc(in []interface{}, funcName string) interface{} {
	switch funcName {
	case FuncLength:
		return len(in)
	default:
		return nil
	}
}

// will use remaining interface and will try to use json-path to navigate to inner structure/value
func ParseJsonPath(in interface{}, jsonPath string) interface{} {
	if jsonPath == "" || in == nil {
		return in
	}
	selectors := strings.Split(jsonPath, ".")
	if len(selectors) == 0 {
		return in
	}
	first := selectors[0]
	remaining := strings.Join(selectors[1:], ".")
	rt := reflect.TypeOf(in)
	var step interface{}
	switch rt.Kind() {
	case reflect.Array, reflect.Slice:
		numero, _ := strconv.Atoi(first)
		step = in.([]interface{})[numero]
	default:
		step = in.(map[string]interface{})[first]
	}

	return ParseJsonPath(step, remaining)
}
