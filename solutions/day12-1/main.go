package main

import (
	"fmt"
	"regexp"
	"slices"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
	pieces  []*eulerlib.TPiece
	puzzles []*eulerlib.TPuzzle
}

func (m *Problem) GetProblemName() string {
	return "Day 12, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "4405895212738"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "2"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) ParsePieces(lines []string) []string {
	re := regexp.MustCompile(`^[0-9]:$`)
	for re.MatchString(lines[0]) {
		p := &eulerlib.TPiece{}
		p.ParseInit(lines[1:4])
		m.pieces = append(m.pieces, p)
		lines = slices.Delete(lines, 0, 5)
	}
	return lines
}

func (m *Problem) ParseCounts(lines []string) {
	for _, line := range lines {
		p := &eulerlib.TPuzzle{}
		parts := strings.Split(line, ": ")
		gridParts := strings.Split(parts[0], "x")
		gridWidth := eulerlib.StrToInt(gridParts[0])
		gridHeight := eulerlib.StrToInt(gridParts[1])
		countParts := strings.Split(parts[1], " ")
		counts := []int{}
		for _, c := range countParts {
			counts = append(counts, eulerlib.StrToInt(c))
		}
		p.Init(gridWidth, gridHeight, m.pieces, counts)
		m.puzzles = append(m.puzzles, p)
	}
}

func (m *Problem) Solve(lines []string) int {
	sum := 0
	m.pieces = make([]*eulerlib.TPiece, 0)
	m.puzzles = make([]*eulerlib.TPuzzle, 0)
	remainingLines := m.ParsePieces(lines)
	m.ParseCounts(remainingLines)

	if eulerlib.GetDebugger().IsDebug() {
		for _, p := range m.puzzles {
			fmt.Println(p.ToString())
		}
	}
	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
