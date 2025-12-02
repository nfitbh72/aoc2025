package eulerlib

import "testing"

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
