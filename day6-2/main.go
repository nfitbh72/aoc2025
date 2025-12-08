package main

import (
	"fmt"
	"strconv"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 6, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "7450962489289"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "3263827"
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

type TField struct {
	operator int
	width    int
}

func (m *Problem) getFields(lastLine string) []TField {
	fields := []TField{}
	count := 0
	currentOperator := -1
	first := true
	for _, lastLine := range lastLine {
		if v, ok := operatorMap[string(lastLine)]; ok {
			if first {
				first = false
			} else {
				fields = append(fields, TField{operator: currentOperator, width: count})
				count = 0
			}
			currentOperator = v
		} else {
			count++
		}
	}
	fields = append(fields, TField{operator: currentOperator, width: count + 1})
	return fields
}

func (m *Problem) parseData(lines []string) ([][]string, []int) {
	lastLine := lines[len(lines)-1]
	fields := m.getFields(lastLine)
	//fmt.Println(fields)
	words := [][]string{}
	operators := []int{}
	startAtColumn := 0
	for i, field := range fields {
		words = append(words, []string{})
		firstLine := true
		for _, line := range lines {
			columnIndex := 0
			for j := field.width - 1; j >= 0; j-- {
				if firstLine {
					words[i] = append(words[i], "")
				}
				chr := string(line[startAtColumn+j])
				if _, err := strconv.Atoi(chr); err == nil {
					words[i][columnIndex] += chr
				} else {
					if v, ok := operatorMap[chr]; ok {
						operators = append(operators, v)
					}
				}
				columnIndex++
			}
			firstLine = false
		}
		startAtColumn += field.width + 1
	}

	//fmt.Println(words)
	return words, operators
}

func (m *Problem) Solve(lines []string) int {
	words, operators := m.parseData(lines)
	/*
		for _, word := range words {
			for _, part := range word {
				fmt.Printf("\"%s\"", part)
			}
			fmt.Println()
		}
	*/
	//fmt.Println(words, operators)

	sum := 0
	for i, problem := range words {
		first := true
		problemTotal := 0
		operator := operators[i]
		switch operator {
		case 0:
			problemTotal = 0
		case 1:
			problemTotal = eulerlib.StrToInt(words[i][0])
		case 2:
			problemTotal = 1
		case 3:
			problemTotal = eulerlib.StrToInt(words[i][0])
		default:
		}

		for _, p := range problem {
			val := eulerlib.StrToInt(p)
			switch operator {
			case 0:
				problemTotal += val
			case 1:
				if !first {
					problemTotal -= val
				}
			case 2:
				problemTotal *= val
			case 3:
				if !first {
					problemTotal /= val
				}
			default:
			}
			first = false
		}
		eulerlib.GetDebugger().Log("problem total", problemTotal)
		//fmt.Printf("%d\n", problemTotal)
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
