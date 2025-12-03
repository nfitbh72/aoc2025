package main

import (
	"fmt"
	"slices"
	"sort"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Day struct {
	eulerlib.Problem
}

func (m *Day) GetProblemName() string {
	return "Day 3, Part 1"
}

func (m *Day) GetAnswer() string {
	return "17179"
}

func (m *Day) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Day) GetShortAnswer() string {
	return "357"
}

func (m *Day) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Day) Solve(lines []string) int {
	sum := 0

	for _, line := range lines {
		perms := []int{}
		for i := 0; i < len(line); i++ {
			for j := i + 1; j < len(line); j++ {
				perms = append(perms, eulerlib.StrToInt(string(line[i])+string(line[j])))
			}
		}
		sort.Ints(perms)
		slices.Reverse(perms)
		fmt.Println(perms[0])
		sum += perms[0]
	}

	return sum
}

func main() {
	d := Day{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println(d.GetAnswer() == answer)
}
