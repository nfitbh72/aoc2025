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
	return "Day 10, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "4725826296"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "7"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

type TMachine struct {
	LightsNeeded []bool
	Buttons      [][]int
	//Joltage []int
}

func (m *Problem) NewMachine(line string) TMachine {
	machine := TMachine{}
	machine.LightsNeeded = make([]bool, 0)
	machine.Buttons = make([][]int, 0)
	parts := strings.Split(line, "]")
	machineString := parts[0][1:]
	for _, c := range machineString {
		if c == '#' {
			machine.LightsNeeded = append(machine.LightsNeeded, true)
		} else {
			machine.LightsNeeded = append(machine.LightsNeeded, false)
		}
	}
	buttonPartsOne := strings.Split(parts[1], "{")
	buttonParts := strings.Split(buttonPartsOne[0], ")")
	for _, buttonsStr := range buttonParts {
		buttonBits := strings.Split(buttonsStr, "(")
		//fmt.Printf("1: \"%s\"\n", buttonBits)
		//fmt.Println(reflect.TypeOf(buttonBits))
		if len(buttonBits) > 1 {
			reallyTheButtonBits := strings.Split(buttonBits[1], ",")
			//fmt.Printf("3: \"%s\"\n", reallyTheButtonBits)
			buttons := make([]int, 0)
			for _, buttonBit := range reallyTheButtonBits {
				buttons = append(buttons, eulerlib.StrToInt(buttonBit))
			}
			machine.Buttons = append(machine.Buttons, buttons)
		}
	}
	return machine
}

// IncrementBase increments a number in a given base
// digits is a slice where each element is 0 to base-1
// Returns true if overflow occurred (all digits wrapped to 0)
func IncrementBase(digits []int, base int) bool {
	for i := len(digits) - 1; i >= 0; i-- {
		digits[i]++
		if digits[i] < base {
			return false // No overflow
		}
		digits[i] = 0 // Wrap to 0 and carry
	}
	return true // Overflow - all digits wrapped
}

func (m *TMachine) SolveLights() int {
	numButtons := len(m.Buttons)
	maxPresses := 10 // Reasonable limit

	// Try 0 presses, 1 press, 2 presses, etc.
	for totalPresses := 0; totalPresses <= maxPresses; totalPresses++ {
		// Create a base-(numButtons) number with totalPresses digits
		// Each digit represents which button to press
		if totalPresses == 0 {
			if m.CheckLights([]int{}) {
				return 0
			}
			continue
		}

		digits := make([]int, totalPresses)
		for {
			if m.CheckLights(digits) {
				return totalPresses
			}

			if IncrementBase(digits, numButtons) {
				break
			}
		}
	}

	return -1 // No solution found
}

func (m *TMachine) CheckLights(buttonPresses []int) bool {
	lights := make([]bool, len(m.LightsNeeded))

	for _, buttonIdx := range buttonPresses {
		for _, lightIdx := range m.Buttons[buttonIdx] {
			lights[lightIdx] = !lights[lightIdx]
		}
	}

	for i := range lights {
		if lights[i] != m.LightsNeeded[i] {
			return false
		}
	}
	return true
}

func (m *Problem) Solve(lines []string) int {
	machines := []TMachine{}
	for _, line := range lines {
		machine := m.NewMachine(line)
		machines = append(machines, machine)
	}
	sum := 0
	for _, machine := range machines {
		sum += machine.SolveLights()
	}
	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
