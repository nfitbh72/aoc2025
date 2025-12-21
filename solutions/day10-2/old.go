package main

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

func (m *TMachine) SolveJoltage() int {
	// Use DFS with pruning to find minimum button presses
	// Try pressing each button 0 to max_needed times

	// Calculate upper bound for each button
	maxPresses := make([]int, len(m.Buttons))
	for i, button := range m.Buttons {
		maxPress := 0
		for _, pos := range button {
			if pos < len(m.JoltageNeeded) && m.JoltageNeeded[pos] > maxPress {
				maxPress = m.JoltageNeeded[pos]
			}
		}
		maxPresses[i] = maxPress
	}

	bestSolution := -1

	var dfs func(buttonIdx int, presses []int, currentJoltage []int, totalPresses int)
	dfs = func(buttonIdx int, presses []int, currentJoltage []int, totalPresses int) {
		// Prune if we already found a better solution
		if bestSolution != -1 && totalPresses >= bestSolution {
			return
		}

		// Base case: tried all buttons
		if buttonIdx == len(m.Buttons) {
			// Check if this is a valid solution
			valid := true
			for i := range m.JoltageNeeded {
				if currentJoltage[i] != m.JoltageNeeded[i] {
					valid = false
					break
				}
			}
			if valid {
				if bestSolution == -1 || totalPresses < bestSolution {
					bestSolution = totalPresses
				}
			}
			return
		}

		// Try pressing this button 0 to maxPresses[buttonIdx] times
		for numPress := 0; numPress <= maxPresses[buttonIdx]; numPress++ {
			// Check if this would cause overflow
			canPress := true
			newJoltage := make([]int, len(currentJoltage))
			copy(newJoltage, currentJoltage)

			for _, pos := range m.Buttons[buttonIdx] {
				if pos < len(m.JoltageNeeded) {
					newJoltage[pos] += numPress
					if newJoltage[pos] > m.JoltageNeeded[pos] {
						canPress = false
						break
					}
				}
			}

			if canPress {
				newPresses := make([]int, len(presses))
				copy(newPresses, presses)
				newPresses[buttonIdx] = numPress
				dfs(buttonIdx+1, newPresses, newJoltage, totalPresses+numPress)
			}
		}
	}

	initialJoltage := make([]int, len(m.JoltageNeeded))
	initialPresses := make([]int, len(m.Buttons))
	dfs(0, initialPresses, initialJoltage, 0)

	return bestSolution
}

func (m *TMachine) CheckJoltage(buttonPresses []int) bool {
	// Count how many times each position/counter is affected (use cached maxPos)
	counterValues := make([]int, m.maxPos+1)

	// Each button press affects multiple positions
	for _, buttonIdx := range buttonPresses {
		for _, positionIdx := range m.Buttons[buttonIdx] {
			counterValues[positionIdx]++
			// Early termination: if any counter exceeds target, this won't work
			if positionIdx < len(m.JoltageNeeded) && counterValues[positionIdx] > m.JoltageNeeded[positionIdx] {
				return false
			}
		}
	}

	// Check if counter values match required joltage exactly
	for i := range m.JoltageNeeded {
		if counterValues[i] != m.JoltageNeeded[i] {
			return false
		}
	}
	return true
}
