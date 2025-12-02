package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type D1 struct {
	eulerlib.Problem
}

func (m *D1) GetProblemName() string {
	return "Day 1"
}

func (m *D1) GetAnswer() string {
	return "999"
}

func (m *D1) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *D1) GetShortAnswer() string {
	return "3"
}

func (m *D1) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *D1) Solve(lines []string) int {
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
	return d.GetNumZeros()
}

func main() {
	d := D1{}
	fmt.Println(d.GenerateAnswer())
}
