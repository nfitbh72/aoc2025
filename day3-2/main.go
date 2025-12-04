package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 3, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "170025781683941"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "3121910778619"
}

func (m *Problem) GenerateShortAnswer() string {
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

func (m *Problem) getHighestPossiblePerm(s string, resultDigitLength int) int {
	if resultDigitLength <= 0 || resultDigitLength > len(s) {
		return 0
	}

	// want the largest subsequence of length resultDigitLength
	// while preserving order. this can be done using a stack algorithm.
	stack := eulerlib.NewStack()

	// can only drop at most len(s)-resultDigitLength digits.
	drop := len(s) - resultDigitLength

	// at each step, if the current digit c is greater than the previous digits in the
	// string so far and we still have the option to drop digits (drop > 0), it’s
	// always better to drop that smaller last digit in favor of c
	// e.g. the number of digits in the string is 20, the number we want is 12,
	// the first 5 digits are 93214... and we're at the 5th digit (4)
	// * 4 > 1 and we have 8 drops left
	// * 4 > 2 and we have 7 drops left
	// * 4 > 3 and we have 6 drops left
	// the maximum possible number is guaranteed to start with 94...
	// 94... is always going to be larger than 93..., etc with the fixed number of digits
	for i := 0; i < len(s); i++ {
		c := s[i] //c is a byte/rune
		for drop > 0 && stack.GetSize() > 0 && stack.Peek().(byte) < c {
			_ = stack.Pop()
			drop--
		}
		stack.Push(c)
	}

	// keep only the first resultDigitLength digits in case we didn't drop all
	// allowed digits and build the resulting integer from the bytes
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

func (m *Problem) Solve(lines []string) int {
	sum := 0
	for _, line := range lines {
		i := m.getHighestPossiblePerm(line, 12)
		eulerlib.GetDebugger().Log(i)
		sum += i
	}
	//day 3, part 2 answer is the sum of all highest-possible perms
	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
