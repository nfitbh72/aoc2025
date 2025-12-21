package eulerlib

type TRange struct {
	Lower int
	Upper int
}

type TRanges []TRange

func (m *TRange) IsInRange(i int) bool {
	if i >= m.Lower && i <= m.Upper {
		return true
	}
	return false

}

func (m *TRanges) GetRangesThatContain(i int) TRanges {
	containedRanges := TRanges{}
	for _, r := range *m {
		if r.IsInRange(i) {
			containedRanges = append(containedRanges, r)
		}
	}
	return containedRanges
}

func (m *TRanges) GetIndexOfFirstThatContains(i int) int {
	for j, r := range *m {
		if r.IsInRange(i) {
			return j
		}
	}
	return -1
}

func (m *TRanges) merge() *TRanges {
	newRanges := TRanges{}
	for _, r := range *m {
		// if the lower number is within an existing range and
		// the upper number is higher than the existing range
		// then extend the existing range
		existingLowerPos := newRanges.GetIndexOfFirstThatContains(r.Lower)
		if existingLowerPos != -1 && r.Upper > newRanges[existingLowerPos].Upper {
			//fmt.Println("extending", newRanges[existingLowerPos], "with", r[1])
			//fmt.Println("merging", r, "with", newRanges[existingLowerPos], "(higher)")
			newRanges[existingLowerPos].Upper = r.Upper
			//fmt.Println("the new range is", newRanges[existingLowerPos])
			//fmt.Println()
		}
		// if the uppoer number is within an existing range and
		// the lower number is less than the existing range
		// then extend the existing range
		existingUpperPos := newRanges.GetIndexOfFirstThatContains(r.Upper)
		if existingUpperPos != -1 && r.Lower < newRanges[existingUpperPos].Lower {
			//fmt.Println("extending", newRanges[existingUpperPos], "with", r[0])
			//fmt.Println("merging", r, "with", newRanges[existingUpperPos], "(lower)")
			newRanges[existingUpperPos].Lower = r.Lower
			//fmt.Println("the new range is", newRanges[existingUpperPos])
			//fmt.Println()
		}

		// if the lower and upper numbers are not within an existing range
		// then keep the range
		if existingLowerPos == -1 && existingUpperPos == -1 {
			newRanges = append(newRanges, r)
		}
	}
	//fmt.Println(newRanges)
	return &newRanges
}

func (m *TRanges) Merge() *TRanges {
	var newRanges TRanges
	previousLen := 0
	current := m
	for {
		newRanges = *current.merge()
		//fmt.Println(previousLen, len(newRanges))
		if len(newRanges) == previousLen {
			break
		}
		previousLen = len(newRanges)
		current = &newRanges
	}
	return &newRanges
}

func (m *TRange) IsContainedWithin(r *TRange) bool {
	if m.Lower > r.Lower && m.Upper < r.Upper {
		return true
	}
	return false
}

func (m *TRanges) RemoveContainedRanges() *TRanges {
	newRanges := TRanges{}
	for i, r := range *m {
		addThisRange := true
		// Check if r is fully contained within any other range
		for j, other := range *m {
			// Skip comparing range with itself (same index)
			if i == j {
				continue
			}

			// If r is fully contained within other, don't add it
			// For identical ranges, keep the one with lower index (j < i means other comes first)
			if r.Lower >= other.Lower && r.Upper <= other.Upper {
				// If ranges are identical, only skip if this is not the first occurrence
				if r.Lower == other.Lower && r.Upper == other.Upper && j < i {
					addThisRange = false
					break
				}
				// If r is strictly contained (not identical), always skip
				if r.Lower > other.Lower || r.Upper < other.Upper {
					addThisRange = false
					break
				}
			}
		}
		if addThisRange {
			newRanges = append(newRanges, r)
		}
	}
	return &newRanges
}

func (m *TRanges) CountAll() int {
	count := 0
	for _, i := range *m {
		count += i.Upper - i.Lower + 1
	}
	return count
}
