package main

import (
	"fmt"
	"testing"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

func TestGetAdjacentCountDebug(t *testing.T) {
	lines := []string{
		"..@@.@@@@.",
		"@@@.@.@.@@",
		"@@@@@.@.@@",
		"@.@@@@..@.",
		"@@.@@@@.@@",
		".@@@@@@@.@",
		".@.@.@.@@@",
		"@.@@@.@@@@",
		".@@@@@@@@.",
		"@.@.@@@.@.",
	}

	g := &eulerlib.TGrid{}
	g.Init()
	g.ParseTable(lines, false)

	// Test a few specific positions
	testCases := []struct {
		x, y     int
		char     rune
		expected int
		desc     string
	}{
		{0, 0, '@', 2, "top-left corner (.) checking for @"},
		{1, 0, '@', 3, "position (1,0) (.) checking for @"},
		{0, 1, '@', 4, "position (0,1) (@) checking for @"},
		{3, 0, '@', 5, "position (3,0) (@) checking for @"},
		{4, 4, '@', 7, "center-ish position (4,4) (@) checking for @"},
	}

	for _, tc := range testCases {
		count := g.GetAdjacentCount(tc.x, tc.y, tc.char)
		cellValue := g.Values[tc.y][tc.x].(rune)
		fmt.Printf("Position (%d,%d) = '%c': GetAdjacentCount('%c') = %d (expected %d) - %s\n",
			tc.x, tc.y, cellValue, tc.char, count, tc.expected, tc.desc)

		// Also print what's actually adjacent
		fmt.Printf("  Adjacent cells: ")
		directions := [][]int{
			{-1, -1}, {0, -1}, {1, -1},
			{-1, 0}, {1, 0},
			{-1, 1}, {0, 1}, {1, 1},
		}
		for _, dir := range directions {
			newX := tc.x + dir[0]
			newY := tc.y + dir[1]
			if newX >= 0 && newX < len(g.Values[0]) && newY >= 0 && newY < len(g.Values) {
				val := g.Values[newY][newX].(rune)
				fmt.Printf("(%d,%d)='%c' ", newX, newY, val)
			}
		}
		fmt.Println()
	}

	// Now test all '.' positions with < 4 adjacent '@'
	fmt.Println("\nAll '.' positions with < 4 adjacent '@':")
	for y, row := range g.Values {
		for x, val := range row {
			if val.(rune) == '.' {
				count := g.GetAdjacentCount(x, y, '@')
				fmt.Printf("  (%d,%d): %d adjacent '@'\n", x, y, count)
			}
		}
	}
}
