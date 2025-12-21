package eulerlib

import (
	"fmt"
	"math/big"
	"reflect"
	"testing"
)

// TTest describes a single table-driven test case used across helper
// functions and problem tests in this package.
type TTest struct {
	Name      string
	Input     any
	Expect    any
	Unordered bool
	KeyValues map[string]any
}

// ReportSuccess writes a concise success message for a completed test case.
func ReportSuccess(context string, test TTest) {
	fmt.Printf("ok: %s; %s\n", context, test.Name)
}

// ReportError records a detailed failure message on the provided testing.T,
// including input, expected value and actual output.
func ReportError(t *testing.T, context string, test TTest, output any) {
	t.Errorf("Testing %s; %s, input is %v, expected was %v, output was %v", context, test.Name, test.Input, test.Expect, output)
}

// CheckTest compares a test case's expected value with the supplied output
// using type-appropriate equality, reporting success or failure via
// ReportSuccess and ReportError.
func CheckTest(t *testing.T, context string, test TTest, output any) {
	ok := false
	outputKind := reflect.TypeOf(output).Kind()
	//fmt.Println("output is a kind of", outputKind)
	if outputKind == reflect.Slice ||
		outputKind == reflect.Array ||
		outputKind == reflect.Map ||
		outputKind == reflect.Struct {
		//fmt.Println("using reflect to compare")
		if test.Unordered {
			if reflect.TypeOf(output) == reflect.TypeOf([]int{}) {
				ok = IsSameUnorderedSlice(test.Expect.([]int), output.([]int))
			} else {
				ok = IsSameUnorderedStringSlice(test.Expect.([]string), output.([]string))
			}
		} else {
			ok = reflect.DeepEqual(test.Expect, output)
		}
	} else if outputKind == reflect.Ptr {
		//when a pointer, need to see what type they point to, assume this is a *big.Int for now
		//cant seem to dereference interface{} (any), therefore check the String() output of the type
		strType := reflect.TypeOf(output).String()
		if strType == "*big.Int" {
			ok = (test.Expect.(*big.Int).Cmp(output.(*big.Int)) == 0)
		}
	} else {
		ok = (test.Expect == output)
	}
	if !ok {
		ReportError(t, context, test, output)
	} else {
		ReportSuccess(context, test)
	}
}
