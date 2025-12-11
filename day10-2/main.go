package main

import (
	"fmt"
	"strings"
	"sync"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 10, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "4725826296"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "33"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

type TMachine struct {
	MachineNumber int
	//LightsNeeded               []bool
	Buttons                    [][]int
	JoltageNeeded              []int
	maxPos                     int // Cache max position for efficiency
	SmallestButtonPresses      []int
	SmallestButtonPressesCount int
	AnyFound                   bool
	maxPresses                 []int
	MaxPressAllButtons         int
}

func (m *Problem) NewMachine(line string) *TMachine {
	machine := TMachine{}
	//machine.LightsNeeded = make([]bool, 0)
	//machine.Buttons = make([][]int, 0)
	parts := strings.Split(line, "]")
	/*
		machineString := parts[0][1:]
			for _, c := range machineString {
				if c == '#' {
					machine.LightsNeeded = append(machine.LightsNeeded, true)
				} else {
					machine.LightsNeeded = append(machine.LightsNeeded, false)
				}
			}
	*/
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
	//fmt.Println("\"", buttonPartsOne[1], "\"")
	joltageParts := buttonPartsOne[1][:len(buttonPartsOne[1])-1]
	//fmt.Println(joltageParts)
	machine.JoltageNeeded = make([]int, 0)
	for _, joltageStr := range strings.Split(joltageParts, ",") {
		machine.JoltageNeeded = append(machine.JoltageNeeded, eulerlib.StrToInt(joltageStr))
	}

	// Calculate upper bound for each button
	machine.maxPresses = make([]int, len(machine.Buttons))
	machine.MaxPressAllButtons = 0
	for i, button := range machine.Buttons {
		maxPress := 0
		for _, pos := range button {
			if pos < len(machine.JoltageNeeded) && machine.JoltageNeeded[pos] > maxPress {
				maxPress = machine.JoltageNeeded[pos]
			}
			if machine.JoltageNeeded[pos] > machine.MaxPressAllButtons {
				machine.MaxPressAllButtons = machine.JoltageNeeded[pos]
			}
		}
		machine.maxPresses[i] = maxPress
	}

	//machine.CurrentJoltage = make([]int, len(machine.JoltageNeeded))
	//machine.ButtonPresses = make([]int, len(machine.Buttons))
	machine.SmallestButtonPresses = make([]int, len(machine.Buttons))
	for i := range machine.SmallestButtonPresses {
		machine.SmallestButtonPresses[i] = machine.maxPresses[i]
	}
	machine.SmallestButtonPressesCount = machine.MaxPressAllButtons * len(machine.Buttons)

	return &machine
}

const STATUS_OVER_JOLTAGE = 1
const STATUS_EQUAL_JOLTAGE = 2
const STATUS_NO_MATCH = 0

func (m *TMachine) JoltageCompare(currentJoltage []int) int {
	allMatch := true
	for i, v := range m.JoltageNeeded {
		if currentJoltage[i] > v {
			return STATUS_OVER_JOLTAGE
		}
		if v != currentJoltage[i] {
			allMatch = false
		}
	}
	if allMatch {
		return STATUS_EQUAL_JOLTAGE
	}
	return STATUS_NO_MATCH
}

func (m *TMachine) GetTotalButtonPresses(buttonPresses []int) int {
	sum := 0
	for _, v := range buttonPresses {
		sum += v
	}
	return sum
}

func (m *TMachine) SmashButtons(buttonNumber int, buttonPressesOriginal []int, currentJoltageOriginal []int) {
	//take a copy of currentJoltage and buttonPresses
	currentJoltage := make([]int, len(currentJoltageOriginal))
	copy(currentJoltage, currentJoltageOriginal)
	buttonPresses := make([]int, len(buttonPressesOriginal))
	copy(buttonPresses, buttonPressesOriginal)

	// iterate to max presses + 1
	// possible combo is that the below buttons could be the correct joltage when this button is pressed 0 times or when max presses is +1
	for i := range m.maxPresses[buttonNumber] + 1 {

		// check buttons below before pressing, possible combo is that this button is pressed 0 times or when max presses is +1
		if buttonNumber < len(m.Buttons)-1 {
			m.SmashButtons(buttonNumber+1, buttonPresses, currentJoltage)
		}

		if i == m.maxPresses[buttonNumber] {
			break
		}
		//  press my button once 0 add the joltages and increment this button's presses
		for _, joltageIdx := range m.Buttons[buttonNumber] {
			currentJoltage[joltageIdx]++
		}
		buttonPresses[buttonNumber]++
		if eulerlib.GetDebugger().IsDebug() {
			fmt.Println(m.MachineNumber, buttonNumber, "pressed button", buttonPresses, currentJoltage)
		}

		// check on the status of our joltages
		status := m.JoltageCompare(currentJoltage)

		// success, we found one solution
		if status == STATUS_EQUAL_JOLTAGE {
			if eulerlib.GetDebugger().IsDebug() {
				fmt.Println(m.MachineNumber, buttonNumber, "FOUND!")
			}

			// note: did have mutex/lock code here, but realised that each *machine* is in it's own go func,
			// therefore this is not actually shared data

			// is this the smallest solution found so far for this machine?
			if m.GetTotalButtonPresses(buttonPresses) < m.SmallestButtonPressesCount {
				if eulerlib.GetDebugger().IsDebug() {
					fmt.Println(m.MachineNumber, buttonNumber, "AND IT'S SMALLEST")
				}
				m.SmallestButtonPressesCount = m.GetTotalButtonPresses(buttonPresses)
				copy(m.SmallestButtonPresses, buttonPresses)
				m.AnyFound = true
			}

			if eulerlib.GetDebugger().IsDebug() {
				fmt.Println(m.MachineNumber, buttonNumber, "returning because equal")
			}
			return
		}

		if status == STATUS_OVER_JOLTAGE {
			if eulerlib.GetDebugger().IsDebug() {
				fmt.Println(m.MachineNumber, buttonNumber, "returning because over")
			}
			return
		}

	}
	if eulerlib.GetDebugger().IsDebug() {
		fmt.Println(m.MachineNumber, buttonNumber, "returning because no match")
	}
}

func (m *Problem) Solve(lines []string) int {
	machines := []*TMachine{}
	for i, line := range lines {
		machine := m.NewMachine(line)
		machine.MachineNumber = i
		machines = append(machines, machine)
	}

	// Use WaitGroup to wait for all goroutines to complete
	var wg sync.WaitGroup
	// Use mutex to protect sum from concurrent writes
	var mu sync.Mutex
	sum := 0
	countFound := 0
	// Process each machine in parallel
	for i := range machines {
		wg.Add(1)
		go func(machineIdx int) {
			defer wg.Done()

			machine := machines[machineIdx]
			fmt.Println(machine)
			currentJoltage := make([]int, len(machine.JoltageNeeded))
			buttonPresses := make([]int, len(machine.Buttons))
			machine.SmashButtons(0, buttonPresses, currentJoltage)

			if machine.AnyFound {
				localSum := 0
				for _, v := range machine.SmallestButtonPresses {
					localSum += v
				}
				// Safely increment countFound and add to sum (chances of collision are very low, but still possible)
				// happens only once per machine
				mu.Lock()
				countFound++
				fmt.Println(machine.MachineNumber, "completed!", countFound, "found so far")
				sum += localSum
				mu.Unlock()
			} else {
				fmt.Printf("%d did not find a solution! (%d found so far)\n", machine.MachineNumber, countFound)
			}
		}(i)
	}

	// Wait for all goroutines to finish
	wg.Wait()

	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
