package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
	grid       eulerlib.TGrid
	countCache map[string]int
}

func (m *Problem) GetProblemName() string {
	return "Day 7, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "40941112789504"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "40"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) GetCacheKey(pos *eulerlib.TGridPosition) string {
	return fmt.Sprintf("%d,%d", pos.X, pos.Y)
}

func (m *Problem) CountBeams(pos *eulerlib.TGridPosition) int {
	// check cache first
	cacheKey := m.GetCacheKey(pos)
	if cached, exists := m.countCache[cacheKey]; exists {
		return cached
	}

	var err error = nil
	for err == nil {
		pos, err = m.grid.WalkFromWithBlocker(pos, '^')
	}

	var count int
	// blocked means we hit the blocker
	if err.Error() == "blocked" {
		// spawn 2 beams
		left := &eulerlib.TGridPosition{X: pos.X - 1, Y: pos.Y + 1, Direction: eulerlib.DownDirection}
		right := &eulerlib.TGridPosition{X: pos.X + 1, Y: pos.Y + 1, Direction: eulerlib.DownDirection}
		count = m.CountBeams(left) + m.CountBeams(right)
	} else {
		// reached the bottom - this is one beam
		count = 1
	}
	// Cache the result
	m.countCache[cacheKey] = count
	return count
}

func (m *Problem) Solve(lines []string) int {
	m.grid = eulerlib.TGrid{}
	m.grid.Init()
	m.grid.ParseTable(lines, false)
	m.countCache = make(map[string]int)
	startX, startY := m.grid.FindElement('S')
	start := &eulerlib.TGridPosition{X: startX, Y: startY, Direction: eulerlib.DownDirection}
	return m.CountBeams(start)
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
