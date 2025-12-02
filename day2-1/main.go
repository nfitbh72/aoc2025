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
	return ""
}

func (m *Day) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Day) GetShortAnswer() string {
	return "6"
}

func (m *Day) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Day) Solve(lines []string) int {
	sum := 0
	codes := strings.Split(lines[0], ",")
	for _, code := range codes {
		ids := strings.Split(code, "-")
		for _, id := range ids {
			if eulerlib.IsEven(len(id)) {
				idFirstHalf := id[:len(id)/2]
				idSecondHalf := id[len(id)/2:]
				if idFirstHalf == idSecondHalf {
					sum += eulerlib.StrToInt(id)
				}
			}
		}
	}
	return sum
}

func main() {
	d := Day{}
	fmt.Println(d.Solve([]string{"38593859-123,11-22"}))
	fmt.Println(d.GenerateAnswer())

}
