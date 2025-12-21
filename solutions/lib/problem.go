package eulerlib

import "testing"

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
