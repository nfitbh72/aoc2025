package eulerlib

import (
	"math/big"
	"testing"
)

type TTestProblem struct {
	Problem
}

func (m *TTestProblem) GetProblemName() string {
	return "Test Problem"
}

func (m *TTestProblem) GetAnswer() string {
	return "1234"
}

func (m *TTestProblem) GenerateAnswer() string {
	return "12" + "34"
}

func TestTestProblem(t *testing.T) {
	problem := &TTestProblem{}
	TestProblem(problem, t)
}

// Problem with a working short answer: ensures TestProblem uses the short path.
type TShortProblem struct {
	Problem
}

func (m *TShortProblem) GetProblemName() string { return "Short Problem" }

// Deliberately different from the generated long answer so we can detect if the
// wrong path is used.
func (m *TShortProblem) GetAnswer() string { return "LONG_ANSWER" }

func (m *TShortProblem) GenerateAnswer() string { return "WRONG_LONG_ANSWER" }

func (m *TShortProblem) GetShortAnswer() string { return "SHORT_ANSWER" }

func (m *TShortProblem) GenerateShortAnswer() string { return "SHORT_ANSWER" }

func TestTestProblemUsesShortWhenAvailable(t *testing.T) {
	problem := &TShortProblem{}
	TestProblem(problem, t)
}

// Problem whose GetShortAnswer panics: ensures TestProblem falls back to the
// long path via hasShortAnswer's recover logic.
type TPanickingShortProblem struct {
	Problem
}

func (m *TPanickingShortProblem) GetProblemName() string { return "Panicking Short Problem" }

func (m *TPanickingShortProblem) GetAnswer() string { return "SAFE_LONG" }

func (m *TPanickingShortProblem) GenerateAnswer() string { return "SAFE_LONG" }

func (m *TPanickingShortProblem) GetShortAnswer() string {
	panic("short answer not implemented")
}

func TestTestProblemFallsBackToLongOnPanic(t *testing.T) {
	problem := &TPanickingShortProblem{}
	TestProblem(problem, t)
}

// Exercise the big.Int pointer branch in CheckTest.
func TestCheckTestBigInt(t *testing.T) {
	expect := big.NewInt(1234)
	output := big.NewInt(1234)
	test := TTest{
		Name:   "big.Int equality",
		Input:  nil,
		Expect: expect,
	}
	CheckTest(t, "tests.CheckTestBigInt", test, output)
}

// Exercise the unordered int-slice comparison branch in CheckTest.
func TestCheckTestUnorderedIntSlice(t *testing.T) {
	test := TTest{
		Name:      "unordered int slice equality",
		Input:     nil,
		Expect:    []int{1, 2, 3},
		Unordered: true,
	}
	output := []int{3, 2, 1}
	CheckTest(t, "tests.CheckTestUnorderedIntSlice", test, output)
}

// Intentionally fail a CheckTest comparison to drive the ReportError path.
func TestCheckTestReportsErrorOnMismatch(t *testing.T) {
	test := TTest{
		Name:   "mismatched ints",
		Input:  nil,
		Expect: 1,
	}
	CheckTest(t, "tests.CheckTestReportsErrorOnMismatch", test, 2)
}
