package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Day struct {
	eulerlib.Problem
	current           []int
	currentString     string
	strLen            int
	resultDigitLength int
	highestFound      int
}

func (m *Day) GetProblemName() string {
	return "Day 3, Part 1"
}

func (m *Day) GetAnswer() string {
	return "17179"
}

func (m *Day) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Day) GetShortAnswer() string {
	return "3121910778619"
}

func (m *Day) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

/*
//well this would have worked, it's just too slow
func (m *Day) depthFirstSearch(start, depth int) {
	if depth == m.resultDigitLength {
		// convert the collected digits into a single integer
		val := 0
		for _, d := range m.current {
			val = val*10 + d
		}
		if val > m.highestFound {
			m.highestFound = val
		}
		return
	}

	// remaining positions we still need to fill
	remaining := m.resultDigitLength - depth
	// ensure enough characters left: i can go up to n-remaining
	for i := start; i <= m.strLen-remaining; i++ {
		m.current[depth] = int(m.currentString[i] - '0')
		m.depthFirstSearch(i+1, depth+1)
	}
}
*/

func (m *Day) getHighestPossiblePerm(s string, resultDigitLength int) int {
	if resultDigitLength <= 0 || resultDigitLength > len(s) {
		return 0
	}

	// we want the lexicographically largest subsequence of length resultDigitLength
	// while preserving order. this can be done in O(n) using a greedy stack-based
	// algorithm: we may drop at most len(s)-resultDigitLength digits.
	drop := len(s) - resultDigitLength
	stack := eulerlib.NewStack()

	// at each step, if the current digit c is greater than the last digit in the
	// string so far and we still have the option to drop digits (drop > 0), it’s
	// always better to drop that smaller last digit in favor of c
	// e.g. the number of digits in the string is 20, the number we want is 12,
	// the first 5 digits are 93214... and we're at the 5th digit (4)
	// * 4 > 1 and we have 8 drops left
	// * 4 > 2 and we have 7 drops left
	// * 4 > 3 and we have 6 drops left
	// the maximum possible number is guaranteed to start with 94...
	for i := 0; i < len(s); i++ {
		c := s[i]
		for drop > 0 && stack.GetSize() > 0 && stack.Peek().(byte) < c {
			_ = stack.Pop()
			drop--
		}
		stack.Push(c)
	}

	// keep only the first resultDigitLength digits in case we didn't drop all
	// allowed digits and build the resulting integer
	val := 0
	factor := 1
	for stack.GetSize() > 0 {
		c := stack.Pop().(byte)
		if stack.GetSize() < resultDigitLength {
			val += int(c-'0') * factor
			factor = factor * 10
		}
	}
	return val
}

func (m *Day) Solve(lines []string) int {
	sum := 0
	for _, line := range lines {
		i := m.getHighestPossiblePerm(line, 12)
		fmt.Println(i)
		sum += i
	}
	return sum
}

func main() {
	d := Day{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println(d.GetAnswer() == answer)
}
