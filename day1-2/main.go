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
	//create a new dial with 100 positions and starting at position50
	d := eulerlib.NewDial(100, 50)
	for _, line := range lines {
		//direction L or R
		dir := line[:1]
		//number of clicks to turn
		numClicks := eulerlib.StrToInt(line[1:])

		if dir == "L" {
			d.Left(numClicks)
		} else {
			d.Right(numClicks)
		}
	}
	//day 1, part 2 answer is the number of times the dial passed a zero
	return d.GetNumPassingZero()
}

func main() {
	d := Problem{}
	fmt.Println(d.GenerateAnswer())
}
