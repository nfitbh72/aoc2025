package eulerlib

import (
	"testing"
)

func TestTRange_IsInRange(t *testing.T) {
	tests := []struct {
		name     string
		r        TRange
		value    int
		expected bool
	}{
		{"value in range", TRange{Lower: 10, Upper: 20}, 15, true},
		{"value at lower bound", TRange{Lower: 10, Upper: 20}, 10, true},
		{"value at upper bound", TRange{Lower: 10, Upper: 20}, 20, true},
		{"value below range", TRange{Lower: 10, Upper: 20}, 5, false},
		{"value above range", TRange{Lower: 10, Upper: 20}, 25, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.r.IsInRange(tt.value)
			if result != tt.expected {
				t.Errorf("IsInRange(%d) = %v, want %v", tt.value, result, tt.expected)
			}
		})
	}
}

func TestTRanges_GetRangesThatContain(t *testing.T) {
	ranges := TRanges{
		{Lower: 10, Upper: 20},
		{Lower: 15, Upper: 25},
		{Lower: 30, Upper: 40},
	}

	tests := []struct {
		name     string
		value    int
		expected int // number of ranges that contain the value
	}{
		{"value in first range only", 12, 1},
		{"value in two ranges", 18, 2},
		{"value in second range only", 22, 1},
		{"value in no ranges", 27, 0},
		{"value in third range", 35, 1},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ranges.GetRangesThatContain(tt.value)
			if len(result) != tt.expected {
				t.Errorf("GetRangesThatContain(%d) returned %d ranges, want %d", tt.value, len(result), tt.expected)
			}
		})
	}
}

func TestTRanges_GetIndexOfFirstThatContains(t *testing.T) {
	ranges := TRanges{
		{Lower: 10, Upper: 20},
		{Lower: 15, Upper: 25},
		{Lower: 30, Upper: 40},
	}

	tests := []struct {
		name     string
		value    int
		expected int
	}{
		{"value in first range", 12, 0},
		{"value in overlapping ranges", 18, 0}, // should return first
		{"value in second range only", 22, 1},
		{"value not found", 27, -1},
		{"value in third range", 35, 2},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ranges.GetIndexOfFirstThatContains(tt.value)
			if result != tt.expected {
				t.Errorf("GetIndexOfFirstThatContains(%d) = %d, want %d", tt.value, result, tt.expected)
			}
		})
	}
}

func TestTRange_IsContainedWithin(t *testing.T) {
	tests := []struct {
		name     string
		r1       TRange
		r2       TRange
		expected bool
	}{
		{"fully contained", TRange{Lower: 12, Upper: 18}, TRange{Lower: 10, Upper: 20}, true},
		{"not contained - extends lower", TRange{Lower: 8, Upper: 15}, TRange{Lower: 10, Upper: 20}, false},
		{"not contained - extends upper", TRange{Lower: 15, Upper: 25}, TRange{Lower: 10, Upper: 20}, false},
		{"not contained - same bounds", TRange{Lower: 10, Upper: 20}, TRange{Lower: 10, Upper: 20}, false},
		{"not contained - completely outside", TRange{Lower: 25, Upper: 30}, TRange{Lower: 10, Upper: 20}, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.r1.IsContainedWithin(&tt.r2)
			if result != tt.expected {
				t.Errorf("IsContainedWithin(%v, %v) = %v, want %v", tt.r1, tt.r2, result, tt.expected)
			}
		})
	}
}

func TestTRanges_Merge(t *testing.T) {
	tests := []struct {
		name     string
		input    TRanges
		expected TRanges
	}{
		{
			name:     "overlapping ranges - extend upper",
			input:    TRanges{{Lower: 10, Upper: 18}, {Lower: 14, Upper: 19}},
			expected: TRanges{{Lower: 10, Upper: 19}},
		},
		{
			name:     "overlapping ranges - extend lower",
			input:    TRanges{{Lower: 15, Upper: 25}, {Lower: 10, Upper: 20}},
			expected: TRanges{{Lower: 10, Upper: 25}},
		},
		{
			name:     "adjacent ranges",
			input:    TRanges{{Lower: 10, Upper: 15}, {Lower: 16, Upper: 20}},
			expected: TRanges{{Lower: 10, Upper: 15}, {Lower: 16, Upper: 20}}, // not merged (not overlapping)
		},
		{
			name:     "non-overlapping ranges",
			input:    TRanges{{Lower: 10, Upper: 15}, {Lower: 20, Upper: 25}},
			expected: TRanges{{Lower: 10, Upper: 15}, {Lower: 20, Upper: 25}},
		},
		{
			name:     "multiple overlapping ranges",
			input:    TRanges{{Lower: 10, Upper: 15}, {Lower: 12, Upper: 18}, {Lower: 16, Upper: 22}},
			expected: TRanges{{Lower: 10, Upper: 22}},
		},
		{
			name:     "one range contains another",
			input:    TRanges{{Lower: 10, Upper: 30}, {Lower: 15, Upper: 20}},
			expected: TRanges{{Lower: 10, Upper: 30}},
		},
		{
			name:     "empty ranges",
			input:    TRanges{},
			expected: TRanges{},
		},
		{
			name:     "single range",
			input:    TRanges{{Lower: 10, Upper: 20}},
			expected: TRanges{{Lower: 10, Upper: 20}},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.input.Merge()
			if len(*result) != len(tt.expected) {
				t.Errorf("Merge() returned %d ranges, want %d. Got: %v, Want: %v", len(*result), len(tt.expected), *result, tt.expected)
				return
			}
			// Check if all expected ranges are present (order may vary)
			for _, exp := range tt.expected {
				found := false
				for _, res := range *result {
					if res.Lower == exp.Lower && res.Upper == exp.Upper {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("Expected range %v not found in result %v", exp, *result)
				}
			}
		})
	}
}

func TestTRanges_RemoveContainedRanges(t *testing.T) {
	tests := []struct {
		name     string
		input    TRanges
		expected TRanges
	}{
		{
			name:     "remove fully contained range",
			input:    TRanges{{Lower: 10, Upper: 18}, {Lower: 12, Upper: 14}},
			expected: TRanges{{Lower: 10, Upper: 18}},
		},
		{
			name:     "no contained ranges",
			input:    TRanges{{Lower: 10, Upper: 15}, {Lower: 20, Upper: 25}},
			expected: TRanges{{Lower: 10, Upper: 15}, {Lower: 20, Upper: 25}},
		},
		{
			name:     "multiple contained ranges",
			input:    TRanges{{Lower: 10, Upper: 30}, {Lower: 12, Upper: 15}, {Lower: 20, Upper: 25}},
			expected: TRanges{{Lower: 10, Upper: 30}},
		},
		{
			name:     "overlapping but not contained",
			input:    TRanges{{Lower: 10, Upper: 20}, {Lower: 15, Upper: 25}},
			expected: TRanges{{Lower: 10, Upper: 20}, {Lower: 15, Upper: 25}},
		},
		{
			name:     "identical ranges",
			input:    TRanges{{Lower: 10, Upper: 20}, {Lower: 10, Upper: 20}},
			expected: TRanges{{Lower: 10, Upper: 20}},
		},
		{
			name:     "empty ranges",
			input:    TRanges{},
			expected: TRanges{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.input.RemoveContainedRanges()
			if len(*result) != len(tt.expected) {
				t.Errorf("RemoveContainedRanges() returned %d ranges, want %d. Got: %v, Want: %v", len(*result), len(tt.expected), *result, tt.expected)
				return
			}
			// Check if all expected ranges are present (order may vary)
			for _, exp := range tt.expected {
				found := false
				for _, res := range *result {
					if res.Lower == exp.Lower && res.Upper == exp.Upper {
						found = true
						break
					}
				}
				if !found {
					t.Errorf("Expected range %v not found in result %v", exp, *result)
				}
			}
		})
	}
}

func TestTRanges_CountAll(t *testing.T) {
	tests := []struct {
		name     string
		input    TRanges
		expected int
	}{
		{
			name:     "single range",
			input:    TRanges{{Lower: 10, Upper: 20}},
			expected: 11, // 10,11,12,13,14,15,16,17,18,19,20
		},
		{
			name:     "multiple ranges",
			input:    TRanges{{Lower: 10, Upper: 15}, {Lower: 20, Upper: 25}},
			expected: 12, // 6 + 6
		},
		{
			name:     "single value range",
			input:    TRanges{{Lower: 10, Upper: 10}},
			expected: 1,
		},
		{
			name:     "empty ranges",
			input:    TRanges{},
			expected: 0,
		},
		{
			name:     "overlapping ranges (not merged)",
			input:    TRanges{{Lower: 10, Upper: 15}, {Lower: 12, Upper: 18}},
			expected: 13, // counts overlap twice: 6 + 7 = 13
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.input.CountAll()
			if result != tt.expected {
				t.Errorf("CountAll() = %d, want %d", result, tt.expected)
			}
		})
	}
}

func TestTRanges_MergeAndRemoveContained_Integration(t *testing.T) {
	// Test the typical workflow: merge overlapping ranges, then remove contained ones
	tests := []struct {
		name          string
		input         TRanges
		expectedCount int
	}{
		{
			name: "complex scenario",
			input: TRanges{
				{Lower: 10, Upper: 18},
				{Lower: 14, Upper: 19},
				{Lower: 12, Upper: 14},
				{Lower: 30, Upper: 40},
				{Lower: 35, Upper: 38},
			},
			expectedCount: 21, // 10-19 (10 values) + 30-40 (11 values)
		},
		{
			name: "all separate ranges",
			input: TRanges{
				{Lower: 10, Upper: 15},
				{Lower: 20, Upper: 25},
				{Lower: 30, Upper: 35},
			},
			expectedCount: 18, // 6 + 6 + 6
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			merged := tt.input.Merge()
			cleaned := merged.RemoveContainedRanges()
			result := cleaned.CountAll()
			if result != tt.expectedCount {
				t.Errorf("After Merge and RemoveContainedRanges, CountAll() = %d, want %d. Final ranges: %v", result, tt.expectedCount, *cleaned)
			}
		})
	}
}
