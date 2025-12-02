package eulerlib

import "testing"

func TestIsPandigital(t *testing.T) {

	tests := []struct {
		name       string
		numbers    []int
		pandigital []int
		expected   bool
	}{
		{
			name:       "Empty list",
			numbers:    []int{},
			pandigital: []int{1, 9},
			expected:   false,
		},
		{
			name:       "Single element list",
			numbers:    []int{42},
			pandigital: []int{1, 9},
			expected:   false,
		},
		{
			name:       "Multiple elements list",
			numbers:    []int{1, 2, 3, 4, 5, 6, 7, 8},
			pandigital: []int{1, 8},
			expected:   true,
		},
		{
			name:       "Multiple elements list",
			numbers:    []int{1, 9, 2, 3, 8, 4, 5, 7, 6},
			pandigital: []int{1, 9},
			expected:   true,
		},
		{
			name:       "Multiple elements list",
			numbers:    []int{1, 9, 2, 3, 8, 4, 5, 7, 6, 0},
			pandigital: []int{0, 9},
			expected:   true,
		},
		{
			name:       "Multiple elements list",
			numbers:    []int{1406357289},
			pandigital: []int{0, 9},
			expected:   true,
		},
		{
			name:       "Multiple elements list",
			numbers:    []int{195, 426, 783},
			pandigital: []int{1, 9},
			expected:   true,
		},
		{
			name:       "Negative elements list",
			numbers:    []int{-1, -2, -3, -4, -5, -6, -7, -8, -9},
			pandigital: []int{1, 9},
			expected:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := IsPandigital(tt.numbers, tt.pandigital[0], tt.pandigital[1])
			if got != tt.expected {
				t.Errorf("IsPandigital(%v, %d) = %v; want %v",
					tt.numbers, tt.pandigital, got, tt.expected)
			}
		})
	}

}
func TestGetPandigitalProducts(t *testing.T) {
	tests := []TTest{
		{
			Name:   "get pandigital products",
			Input:  []int{1, 9, 150},
			Expect: []int{5796, 5796},
		},
		{
			Name:   "get pandigital products",
			Input:  []int{1, 8, 150},
			Expect: []int{1368, 1768, 2146, 1768, 1368, 2146, 3712, 3712},
		},
	}
	for _, test := range tests {
		CheckTest(t, "GetPandigitalProducts", test, GetPandigitalProducts(
			test.Input.([]int)[0],
			test.Input.([]int)[1],
			test.Input.([]int)[2],
		))
	}

}
