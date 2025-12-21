package main

import (
	"fmt"
	"strings"
	"sync"
	"time"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
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

const (
	StatusInProgress = 0
	StatusSuccess    = 1
	StatusFailed     = 2
)

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
	TotalPresses               int
	Status                     int
	mu                         sync.Mutex
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

func (m *TMachine) SetStatus(status int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.Status = status
}

func (m *TMachine) GetStatus() int {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.Status
}

// BFS helper functions

// joltageKey creates a string key from joltage array for visited map
func joltageKey(joltages []int) string {
	return fmt.Sprint(joltages)
}

// joltagesEqual checks if two joltage arrays are equal
func joltagesEqual(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

// copyAndPress creates a new joltage array with button pressed once
func copyAndPress(joltages []int, button []int) []int {
	newJoltages := make([]int, len(joltages))
	copy(newJoltages, joltages)
	for _, pos := range button {
		if pos < len(newJoltages) {
			newJoltages[pos]++
		}
	}
	return newJoltages
}

// anyExceedsTarget checks if any joltage exceeds the target
func anyExceedsTarget(joltages, target []int) bool {
	for i := range joltages {
		if joltages[i] > target[i] {
			return true
		}
	}
	return false
}

// SolveWithBFS uses your original brute force algorithm
func (m *TMachine) SolveWithBFS() (int, bool) {
	currentJoltage := make([]int, len(m.JoltageNeeded))
	buttonPresses := make([]int, len(m.Buttons))
	m.SmashButtons(0, buttonPresses, currentJoltage)

	if m.AnyFound {
		return m.SmallestButtonPressesCount, true
	}
	return 0, false
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
		m.TotalPresses++
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

func displayProgress(machines []*TMachine, done chan bool) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			// Clear screen and move to top
			fmt.Print("\033[2J\033[H")

			// Calculate max total presses for scaling
			maxPresses := 1
			for _, m := range machines {
				if m.TotalPresses > maxPresses {
					maxPresses = m.TotalPresses
				}
			}

			// Display in 3 columns
			const termWidth = 160
			const numCols = 3
			const colWidth = termWidth / numCols

			numRows := (len(machines) + numCols - 1) / numCols

			for row := 0; row < numRows; row++ {
				for col := 0; col < numCols; col++ {
					idx := col*numRows + row
					if idx >= len(machines) {
						continue
					}

					m := machines[idx]
					status := m.GetStatus()

					// Format: "M123 "
					prefix := fmt.Sprintf("M%-3d ", m.MachineNumber)

					var display string
					if status == StatusSuccess {
						display = prefix + "OK"
					} else if status == StatusFailed {
						display = prefix + "FAIL"
					} else {
						// In progress - show progress bar
						barWidth := colWidth - len(prefix) - 2
						numHashes := 0
						if maxPresses > 0 {
							numHashes = (m.TotalPresses * barWidth) / maxPresses
						}
						if numHashes > barWidth {
							numHashes = barWidth
						}
						bar := ""
						for i := 0; i < numHashes; i++ {
							bar += "#"
						}
						display = prefix + bar
					}

					// Pad to column width
					for len(display) < colWidth {
						display += " "
					}
					fmt.Print(display)
				}
				fmt.Println()
			}

			// Display summary
			inProgress := 0
			succeeded := 0
			failed := 0
			for _, m := range machines {
				switch m.GetStatus() {
				case StatusInProgress:
					inProgress++
				case StatusSuccess:
					succeeded++
				case StatusFailed:
					failed++
				}
			}
			fmt.Printf("\nTotal: %d | In Progress: %d | Success: %d | Failed: %d\n",
				len(machines), inProgress, succeeded, failed)
		}
	}
}

func (m *Problem) Solve(lines []string) int {
	machines := []*TMachine{}
	for i, line := range lines {
		machine := m.NewMachine(line)
		machine.MachineNumber = i
		machine.SetStatus(StatusInProgress)
		machines = append(machines, machine)
	}

	// Start progress display goroutine
	done := make(chan bool)
	go displayProgress(machines, done)

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

			// Use BFS algorithm instead of recursive approach
			totalPresses, found := machine.SolveWithBFS()

			if found {
				machine.SetStatus(StatusSuccess)
				// Safely increment countFound and add to sum
				mu.Lock()
				countFound++
				sum += totalPresses
				mu.Unlock()
			} else {
				machine.SetStatus(StatusFailed)
			}
		}(i)
	}

	// Wait for all goroutines to finish
	wg.Wait()

	// Stop progress display
	done <- true

	// Final display
	fmt.Print("\033[2J\033[H")
	fmt.Printf("All machines completed!\n")
	fmt.Printf("Total machines: %d\n", len(machines))
	fmt.Printf("Successful: %d\n", countFound)
	fmt.Printf("Failed: %d\n", len(machines)-countFound)
	fmt.Printf("Sum of button presses: %d\n", sum)

	return sum
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
