package main

import (
	"fmt"
	"strconv"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 6, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "4405895212738"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "4277556"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

var operatorMap = map[string]int{
	"+": 0,
	"-": 1,
	"*": 2,
	"/": 3,
}

func (m *Problem) parseData(lines []string) ([][]int, []int) {
	problems := [][]int{}
	actions := []int{}
	firstRow := true
	for _, line := range lines {
		words := strings.Fields(line)
		for j, word := range words {
			if firstRow {
				problems = append(problems, []int{})
			}
			if val, err := strconv.Atoi(word); err == nil {
				//fmt.Println("adding", word)
				problems[j] = append(problems[j], val)
			} else {
				if v, ok := operatorMap[word]; ok {
					actions = append(actions, v)
				} else {
					panic("operation not in +, -, *, /")
				}
			}
		}
		firstRow = false
	}
	return problems, actions
}

func (m *Problem) Solve(lines []string) int {
	problems, actions := m.parseData(lines)
	//fmt.Println(problems, actions)
	sum := 0
	for i, problem := range problems {

		first := true
		problemTotal := 0
		switch actions[i] {
		case 0:
			problemTotal = 0
		case 1:
			problemTotal = problem[0]
		case 2:
			problemTotal = 1
		case 3:
			problemTotal = problem[0]
		default:
		}

		for _, p := range problem {
			switch actions[i] {
			case 0:
				problemTotal += p
			case 1:
				if !first {
					problemTotal -= p
				}
			case 2:
				problemTotal *= p
			case 3:
				if !first {
					problemTotal /= p
				}
			default:
			}
			first = false
		}
		sum += problemTotal
	}
	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
