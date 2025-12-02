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
	return "30323879646"
}

func (m *Day) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Day) GetShortAnswer() string {
	return "1227775554"
}

func (m *Day) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

func (m *Day) IsRepeating(id int) bool {
	s := eulerlib.IntToStr(id)
	if !eulerlib.IsEven(len(s)) {
		return false
	}
	firstHalf := s[:len(s)/2]
	secondHalf := s[len(s)/2:]
	return firstHalf == secondHalf
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
