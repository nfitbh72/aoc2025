package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Day struct {
	eulerlib.Problem
}

func (m *Day) GetProblemName() string {
	return "Day 2, Part 1"
}

func (m *Day) GetAnswer() string {
	return ""
}

func (m *Day) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Day) GetShortAnswer() string {
	return "4174379265"
}

func (m *Day) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Day) IsRepeating(id int) bool {
	s := eulerlib.IntToStr(id)
	for subStrLen := 1; subStrLen <= len(s)/2; subStrLen++ {
		numRepeats := len(s) / subStrLen
		//if the id length can be fully repeating with this id
		if subStrLen*numRepeats == len(s) {
			p := s[:subStrLen]
			allRepeatsFound := true
			for j := 0; j < numRepeats; j++ {
				compare := s[j*subStrLen : (j+1)*subStrLen]
				if compare != p {
					allRepeatsFound = false
					break
				}
			}
			if allRepeatsFound {
				return true
			}
		}
	}
	return false
}

func (m *Day) Solve(lines []string) int {
	sum := 0
	codes := strings.Split(lines[0], ",")
	for _, code := range codes {
		ids := strings.Split(code, "-")
		left := eulerlib.StrToInt(ids[0])
		right := eulerlib.StrToInt(ids[1])
		for check := left; check <= right; check++ {
			if m.IsRepeating(check) {
				sum += check
			}
		}
	}
	return sum
}

func main() {
	d := Day{}
	fmt.Println(d.GenerateAnswer())

}
