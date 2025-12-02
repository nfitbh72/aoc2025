package eulerlib

import (
	"fmt"
	"math/big"
	"reflect"
	"testing"
)

type TTest struct {
	Name      string
	Input     any
	Expect    any
	Unordered bool
	KeyValues map[string]any
}

func ReportSuccess(context string, test TTest) {
	fmt.Printf("ok: %s; %s\n", context, test.Name)
}

func ReportError(t *testing.T, context string, test TTest, output any) {
	t.Errorf("Testing %s; %s, input is %v, expected was %v, output was %v", context, test.Name, test.Input, test.Expect, output)
}

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

type Problem interface {
	GetProblemName() string
	GetAnswer() string
	GenerateAnswer() string
	//if the short functions are implemented, they will be used instead of the full answer.
	//some problems can take 5 mins to produce the solution, it is intended that the
	//short solutions will complete within eg 15 seconds for faster bulk-testing.
	//most problems do not require short solutions
	GenerateShortAnswer() string
	GetShortAnswer() string
}

func testLongProblem(problem Problem, t *testing.T) {
	//log.Println("long answer")
	test := TTest{Name: "Solution", Input: nil, Expect: problem.GetAnswer()}
	CheckTest(
		t,
		problem.GetProblemName(),
		test,
		problem.GenerateAnswer(),
	)
}

func testShortProblem(problem Problem, t *testing.T) {
	//log.Println("short answer")
	test := TTest{Name: "Solution", Input: nil, Expect: problem.GetShortAnswer()}
	CheckTest(
		t,
		problem.GetProblemName(),
		test,
		problem.GenerateShortAnswer(),
	)
}

func TestProblem(problem Problem, t *testing.T) {
	defer func() {
		if r := recover(); r != nil {
			testLongProblem(problem, t)
		}
	}()
	get := problem.GetShortAnswer()
	if get == "" {
		testLongProblem(problem, t)
	} else {
		testShortProblem(problem, t)
	}
}
