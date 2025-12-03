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

// Problem defines the interface implemented by each Advent of Code day so
// that common test helpers can verify both full and short solutions.
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

// testLongProblem runs the standard answer path for a Problem and verifies the
// generated answer matches the known correct answer.
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

// testShortProblem runs the short answer path for a Problem and verifies the
// generated short answer matches the expected sample answer.
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

// hasShortAnswer reports whether a Problem implements a usable short answer,
// safely handling any panics from GetShortAnswer.
func hasShortAnswer(problem Problem) (has bool) {
	defer func() {
		if r := recover(); r != nil {
			has = false
		}
	}()
	return problem.GetShortAnswer() != ""
}

// TestProblem chooses between the short and full solution paths for a Problem,
// preferring the short answer when available and falling back to the long
// answer otherwise.
func TestProblem(problem Problem, t *testing.T) {
	if hasShortAnswer(problem) {
		testShortProblem(problem, t)
	} else {
		testLongProblem(problem, t)
	}
}
