package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
	grid     eulerlib.TGrid
	posCache map[string]bool
}

func (m *Problem) GetProblemName() string {
	return "Day 7, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "1662"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "21"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) GetBeams(pos *eulerlib.TGridPosition) {
	var err error = nil
	for err == nil {
		pos, err = m.grid.WalkFromWithBlocker(pos, '^')
	}
	if err.Error() == "blocked" {
		if m.posCache[fmt.Sprintf("%d,%d", pos.X, pos.Y)] {
			return
		}
		m.posCache[fmt.Sprintf("%d,%d", pos.X, pos.Y)] = true
		//fmt.Println("blocked at", pos.X, pos.Y)
		left := &eulerlib.TGridPosition{X: pos.X - 1, Y: pos.Y + 1, Direction: eulerlib.DownDirection}
		right := &eulerlib.TGridPosition{X: pos.X + 1, Y: pos.Y + 1, Direction: eulerlib.DownDirection}
		m.GetBeams(left)
		m.GetBeams(right)
	}
}

func (m *Problem) Solve(lines []string) int {
	m.grid = eulerlib.TGrid{}
	m.grid.Init()
	m.grid.ParseTable(lines, false)
	m.posCache = make(map[string]bool)
	startX, startY := m.grid.FindElement('S')
	start := &eulerlib.TGridPosition{X: startX, Y: startY, Direction: eulerlib.DownDirection}
	m.GetBeams(start)
	return len(m.posCache)
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
