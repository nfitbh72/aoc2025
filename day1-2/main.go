package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Day struct {
	eulerlib.Problem
}

func (m *Day) GetProblemName() string {
	return "Day 1"
}

func (m *Day) GetAnswer() string {
	return "6099"
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
	d := eulerlib.NewDial(100, 50)
	for _, line := range lines {
		dir := line[:1]
		numClicks := eulerlib.StrToInt(line[1:])
		if dir == "L" {
			d.Left(numClicks)
		} else {
			d.Right(numClicks)
		}
	}
	return d.GetNumPassingZero()
}

func main() {
	d := Day{}
	fmt.Println(d.GenerateAnswer())
}
