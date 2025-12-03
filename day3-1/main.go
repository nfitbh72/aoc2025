package main

import (
	"fmt"
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

	//for each line
	for _, line := range lines {
		perms := []int{}
		// create the perms for 2 digit numbers, always kept in the order they
		// originally appeared in the string
		for i := 0; i < len(line); i++ {
			for j := i + 1; j < len(line); j++ {
				perms = append(perms, eulerlib.StrToInt(string(line[i])+string(line[j])))
			}
		}
		// sort perms
		sort.Ints(perms)

		// take the last one
		val := perms[len(perms)-1]
		eulerlib.GetDebugger().Log(val)
		sum += val
	}

	return sum
}

func main() {
	d := Day{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println(d.GetAnswer() == answer)
}
