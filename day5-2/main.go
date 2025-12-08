package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 5, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "354143734113772"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "14"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) parseData(lines []string) *eulerlib.TRanges {
	freshRanges := eulerlib.TRanges{}
	for _, line := range lines {
		if line == "" {
			break
		}
		r := strings.Split(line, "-")
		lower := eulerlib.StrToInt(r[0])
		upper := eulerlib.StrToInt(r[1])
		freshRanges = append(freshRanges, eulerlib.TRange{Lower: lower, Upper: upper})

	}
	return &freshRanges
}

func (m *Problem) Solve(lines []string) int {
	freshRanges := m.parseData(lines)
	freshRanges = freshRanges.Merge()
	freshRanges = freshRanges.RemoveContainedRanges()
	return freshRanges.CountAll()
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
