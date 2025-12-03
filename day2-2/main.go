package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Day struct {
	eulerlib.Problem
}

func (m *Day) GetProblemName() string {
	return "Day 2, Part 1"
}

func (m *Day) GetAnswer() string {
	return "43872163557"
}

func (m *Day) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Day) GetShortAnswer() string {
	return "4174379265"
}

func (m *Day) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Day) Solve(lines []string) int {
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
				sum += check
			}
		}
	}
	return sum
}

func main() {
	d := Day{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println(d.GetAnswer() == answer)
}
