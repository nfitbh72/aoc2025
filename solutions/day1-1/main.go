package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 1, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "999"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "3"
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
	val := d.GetNumZeros()
	eulerlib.GetDebugger().Log(val)
	//day 1, part 1 answer is the number of zeros that the dial ended up on at the end
	//of each turn
	return val
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
