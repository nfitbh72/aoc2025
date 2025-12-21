package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 4, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "170025781683941"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "13"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) Solve(lines []string) int {
	g := &eulerlib.TGrid{}
	g.Init()
	g.ParseTable(lines, false)
	accessibleRolls := map[string]bool{}

	// Check each roll (@) to see if it has fewer than 4 adjacent rolls
	for y, row := range g.Values {
		for x, val := range row {
			if val.(rune) == '@' && g.GetAdjacentCount(x, y, '@') < 4 {
				accessibleRolls[fmt.Sprintf("%d,%d", x, y)] = true
			}
		}
	}

	// Visualization for debugging
	for y := 0; y < len(g.Values); y++ {
		for x := 0; x < len(g.Values[0]); x++ {
			if _, ok := accessibleRolls[fmt.Sprintf("%d,%d", x, y)]; ok {
				fmt.Print("A") // Accessible roll
			} else {
				fmt.Print(string(g.Values[y][x].(rune)))
			}
		}
		fmt.Println()
	}

	count := len(accessibleRolls)
	//day 4, part 1 answer is the count of rolls (@) that have fewer than 4 adjacent rolls
	return count
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
