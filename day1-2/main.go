package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 1, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "6099"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "6"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) Solve(lines []string) int {
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
	d := Problem{}
	fmt.Println(d.GenerateAnswer())
}
