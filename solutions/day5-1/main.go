package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 5, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "868"
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

func (m *Problem) parseData(lines []string) ([][]int, []int) {
	freshRanges := [][]int{}
	ingredientList := []int{}
	seenBlankLine := false
	for _, line := range lines {
		if line == "" {
			seenBlankLine = true

		} else if !seenBlankLine {
			r := strings.Split(line, "-")
			lower := eulerlib.StrToInt(r[0])
			upper := eulerlib.StrToInt(r[1])
			freshRanges = append(freshRanges, []int{lower, upper})
		} else {
			ingredientList = append(ingredientList, eulerlib.StrToInt(line))
		}
	}
	return freshRanges, ingredientList
}

func (m *Problem) Solve(lines []string) int {
	freshRanges, ingredientList := m.parseData(lines)
	fmt.Println("parsed, now processing")
	countFresh := 0
	for _, i := range ingredientList {
		for _, j := range freshRanges {
			if i >= j[0] && i <= j[1] {
				countFresh++
				break
			}
		}
	}
	return countFresh
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
