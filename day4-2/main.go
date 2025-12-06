package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 4, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "170025781683941"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "43"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) DisplayDebug(g *eulerlib.TGrid, accessibleRolls map[string]bool) {
	// visualization for debugging
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
	fmt.Println()
}

func getAccessibleRolls(g eulerlib.TGrid) map[string]bool {
	accessibleRolls := map[string]bool{}
	// Check each roll (@) to see if it has fewer than 4 adjacent rolls
	for y, row := range g.Values {
		for x, val := range row {
			if val.(rune) == '@' && g.GetAdjacentCount(x, y, '@') < 4 {
				accessibleRolls[fmt.Sprintf("%d,%d", x, y)] = true
			}
		}
	}
	return accessibleRolls
}

func removeRolls(g *eulerlib.TGrid, accessibleRolls map[string]bool) int {
	count := 0
	for y, row := range g.Values {
		for x := range row {
			if _, ok := accessibleRolls[fmt.Sprintf("%d,%d", x, y)]; ok {
				g.Values[y][x] = '.'
				count++
			}
		}
	}
	return count
}

func (m *Problem) Solve(lines []string) int {
	g := &eulerlib.TGrid{}
	g.Init()
	g.ParseTable(lines, false)
	countRemovedRolls := 0
	for {
		accessibleRolls := getAccessibleRolls(*g)
		if len(accessibleRolls) == 0 {
			break
		}
		countRemovedRolls += removeRolls(g, accessibleRolls)
		if eulerlib.GetDebugger().IsDebug() {
			m.DisplayDebug(g, accessibleRolls)
		}
	}
	return countRemovedRolls
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
