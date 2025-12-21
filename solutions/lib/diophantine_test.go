package eulerlib

import "testing"

func TestDiophantine(t *testing.T) {
	tests := []struct {
		d, maxX, maxY    int
		expectX, expectY int
		expectFound      bool
	}{
		{2, 100, 100, 3, 2, true},
		{5, 100, 100, 9, 4, true},
		{7, 100, 100, 8, 3, true},
		{13, 1000, 200, 649, 180, true},
		{16, 100, 100, 0, 0, false},       // No solution for d=16
		{108, 1500, 150, 1351, 130, true}, // Example
		{367, 10000, 1000, 0, 0, false},   // No solution for d=367
	}

	for _, test := range tests {
		x, y, found := Diophantine(test.d, test.maxX, test.maxY)
		if x != test.expectX || y != test.expectY || found != test.expectFound {
			t.Errorf("Diophantine(%d, %d, %d) = (%d, %d, %v), want (%d, %d, %v)",
				test.d, test.maxX, test.maxY,
				x, y, found,
				test.expectX, test.expectY, test.expectFound)
		}
	}
}
