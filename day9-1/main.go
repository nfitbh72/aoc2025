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
	return "Day 8, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "4725826296"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "50"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

type TPoint struct {
	X int
	Y int
}

func (m *Problem) Solve(lines []string) int {
	tiles := []TPoint{}
	for _, line := range lines {
		coords := strings.Split(line, ",")
		tiles = append(tiles, TPoint{X: eulerlib.StrToInt(coords[0]), Y: eulerlib.StrToInt(coords[1])})
	}
	max := 0
	for i, t1 := range tiles {
		for j, t2 := range tiles {
			if i != j {
				area := (eulerlib.IntAbs(t1.X-t2.X) + 1) * (eulerlib.IntAbs(t1.Y-t2.Y) + 1)
				if area > max {
					max = area
				}
			}
		}
	}
	return max
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
