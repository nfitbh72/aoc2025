package eulerlib

import (
	"reflect"
	"testing"
)

func TestIsHexagonal(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    int64
		expected bool
	}{
		{"Hexagonal number", int64(45), true},
		{"Non-hexagonal number", 46, false},
		{"Negative number", -1, false},
		{"Zero", 0, false},
		{"One", 1, true},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			h := Hexagonal{}
			result := h.IsPolygonal(tc.input)
			if result != tc.expected {
				t.Errorf("IsHexagonal(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetHexagonalSequence(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    int
		expected []int64
	}{
		{"Hexagonal sequence", 10, []int64{1, 6, 15, 28, 45, 66, 91, 120, 153, 190}},
		{"Negative number", -1, []int64{}},
		{"Zero", 0, []int64{}},
		{"One", 1, []int64{1}},
	}

	// Run test cases
	h := NewHexagonal()
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			h.Reset()
			result := h.GetSequence(tc.input)
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetHexagonalSequence(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestIsPentagonal(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    int64
		expected bool
	}{
		{"Pentagonal number", int64(22), true},
		{"Non-pentagonal number", 23, false},
		{"Negative number", -1, false},
		{"Zero", 0, false},
		{"One", 1, true},
	}

	// Run test cases
	p := NewPentagonal()
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			p.Reset()
			result := p.IsPolygonal(tc.input)
			if result != tc.expected {
				t.Errorf("IsPentagonal(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetPentagonalSequence(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    int
		expected []int64
	}{
		{"Pentagonal sequence", 10, []int64{1, 5, 12, 22, 35, 51, 70, 92, 117, 145}},
		{"Negative number", -1, []int64{}},
		{"Zero", 0, []int64{}},
		{"One", 1, []int64{1}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			p := NewPentagonal()
			result := p.GetSequence(tc.input)
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetPentagonalSequence(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetPentagonalSequenceMap(t *testing.T) {
	testCases := []struct {
		name     string
		input    int
		expected map[int64]bool
	}{
		{"Pentagonal sequence", 10, map[int64]bool{
			1: true, 5: true, 12: true, 22: true, 35: true, 51: true, 70: true, 92: true, 117: true, 145: true,
		}},
		{"Negative number", -1, map[int64]bool{}},
		{"Zero", 0, map[int64]bool{}},
		{"One", 1, map[int64]bool{1: true}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			p := NewPentagonal()
			result := p.GetSequenceMap(tc.input)
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetPentagonalSequenceMap(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}

}

func TestGetTriangleSequence(t *testing.T) {
	// Define test cases
	testCases := []struct {
		name     string
		input    int
		expected []int64
	}{
		{"Triangle sequence", 10, []int64{1, 3, 6, 10, 15, 21, 28, 36, 45, 55}},
		{"Negative number", -1, []int64{}},
		{"Zero", 0, []int64{}},
		{"One", 1, []int64{1}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tri := NewTriangle()
			result := tri.GetSequence(tc.input)
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetTriangleSequence(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}
