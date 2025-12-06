package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 5, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "170025781683941"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "14"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Problem) parseData(lines []string) [][]int {
	freshRanges := [][]int{}
	for _, line := range lines {
		if line == "" {
			break
		}
		r := strings.Split(line, "-")
		lower := eulerlib.StrToInt(r[0])
		upper := eulerlib.StrToInt(r[1])
		freshRanges = append(freshRanges, []int{lower, upper})

	}
	return freshRanges
}

func (m *Problem) isInRange(i int, r []int) bool {
	if i >= r[0] && i <= r[1] {
		return true
	}
	return false
}

func (m *Problem) getRangesThatContain(i int, ranges [][]int) [][]int {
	containedRanges := [][]int{}
	for _, r := range ranges {
		if m.isInRange(i, r) {
			containedRanges = append(containedRanges, r)
		}
	}
	return containedRanges
}

func (m *Problem) getIndexOfRange(i int, ranges [][]int) int {
	for j, r := range ranges {
		if m.isInRange(i, r) {
			return j
		}
	}
	return -1
}

func (m *Problem) mergeRanges(ranges [][]int) [][]int {
	newRanges := [][]int{}
	for _, r := range ranges {
		// if the lower number is within an existing range and
		// the upper number is higher than the existing range
		// then extend the existing range
		existingLowerPos := m.getIndexOfRange(r[0], newRanges)
		if existingLowerPos != -1 && r[1] > newRanges[existingLowerPos][1] {
			//fmt.Println("extending", newRanges[existingLowerPos], "with", r[1])
			fmt.Println("merging", r, "with", newRanges[existingLowerPos], "(higher)")
			newRanges[existingLowerPos][1] = r[1]
			fmt.Println("the new range is", newRanges[existingLowerPos])
			fmt.Println()
		}
		// if the uppoer number is within an existing range and
		// the lower number is less than the existing range
		// then extend the existing range
		existingUpperPos := m.getIndexOfRange(r[1], newRanges)
		if existingUpperPos != -1 && r[0] < newRanges[existingUpperPos][0] {
			//fmt.Println("extending", newRanges[existingUpperPos], "with", r[0])
			fmt.Println("merging", r, "with", newRanges[existingUpperPos], "(lower)")
			newRanges[existingUpperPos][0] = r[0]
			fmt.Println("the new range is", newRanges[existingUpperPos])
			fmt.Println()
		}

		// if the lower and upper numbers are not within an existing range
		// then keep the range
		if existingLowerPos == -1 && existingUpperPos == -1 {
			newRanges = append(newRanges, r)
		}
	}
	//fmt.Println(newRanges)
	return newRanges
}

func (m *Problem) isAConaintedWithinB(a []int, b []int) bool {
	if a[0] > b[0] && a[1] < b[1] {
		return true
	}
	return false
}

func (m *Problem) isAContainedWithinAnyB(a []int, b [][]int) bool {
	for _, r := range b {
		if m.isAConaintedWithinB(a, r) {
			return true
		}
	}
	return false
}

func (m *Problem) removeContainedRanges(ranges [][]int) [][]int {
	newRanges := [][]int{}
	for _, r := range ranges {
		a := m.getRangesThatContain(r[0], ranges)
		a = append(a, m.getRangesThatContain(r[1], ranges)...)
		addThisRange := true
		if len(a) > 2 {
			if m.isAContainedWithinAnyB(r, a) {
				fmt.Println(r, "is contained within", a)
				addThisRange = false
			}
		}
		if addThisRange {
			newRanges = append(newRanges, r)
		}
	}
	return newRanges
}

func (m *Problem) Solve(lines []string) int {
	freshRanges := m.parseData(lines)
	fmt.Println("starting with", len(freshRanges), "ranges")
	previousLen := 0
	for {
		freshRanges = m.mergeRanges(freshRanges)
		fmt.Println(previousLen, len(freshRanges))
		if len(freshRanges) == previousLen {
			break
		}
		previousLen = len(freshRanges)
	}
	freshRanges = m.removeContainedRanges(freshRanges)
	fmt.Println("parsed, now processing")
	countFresh := 0
	for _, i := range freshRanges {
		countFresh += i[1] - i[0] + 1
	}
	return countFresh
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
