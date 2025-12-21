package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 2, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "43872163557"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "4174379265"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) Solve(lines []string) int {
	sum := 0
	//split by comma
	codes := strings.Split(lines[0], ",")
	for _, code := range codes {
		//split left and right by hyphen
		ids := strings.Split(code, "-")
		left := eulerlib.StrToInt(ids[0])
		right := eulerlib.StrToInt(ids[1])
		//use left and right as the range of numbers to check
		for check := left; check <= right; check++ {
			//sum the matching numbers
			if eulerlib.HasRepeatingPattern(eulerlib.IntToStr(check)) {
				//fmt.Println(check)
				sum += check
			}
		}
	}
	//day 2, part 2 answer is the sum of all matching numbers
	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println(d.GetAnswer() == answer)
}
