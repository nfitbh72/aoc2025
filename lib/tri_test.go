package eulerlib

import (
	"testing"
)

func TestTriInit(t *testing.T) {
	tri := Tri{}
	tri.Init([][]int{{1}, {2, 3}, {4, 5, 6}}, 0, 0)
	if tri.Val != 1 {
		t.Errorf("top of tree should be %d", 1)
	} else {
		if tri.R.Val != 2 || tri.L.Val != 3 {
			t.Errorf("2nd row of triangle should be %d, %d, found %d, %d", 2, 3, tri.R.Val, tri.L.Val)
		} else {
			if tri.L.L.Val != 6 || tri.L.R.Val != 5 || tri.R.L.Val != 5 || tri.R.R.Val != 4 {
				t.Errorf(
					"3rd row of triangle should be %d, %d, %d, %d, found %d, %d, %d, %d",
					6, 5, 5, 4, tri.L.L.Val, tri.L.R.Val, tri.R.L.Val, tri.R.R.Val,
				)
			}
		}
	}
}

func TestTriGetTotalMaxPath(t *testing.T) {
	tri := Tri{}
	tri.Init([][]int{{1}, {2, 3}, {4, 5, 6}}, 0, 0)
	if tri.GetTotalMaxPath() != 10 {
		t.Errorf("max path should be %d, found %d", 16, tri.GetTotalMaxPath())
	}
}

func TestIsTriangleWord(t *testing.T) {
	triangles := make(map[int]bool)
	for i := range 26 {
		j := i + 1
		triangles[(j+1)*j/2] = true
	}
	test := "WOMAN"
	if !IsTriangleWord(triangles, test) {
		t.Errorf("%s should be a triangle word", test)
	}
	test = "WORLD"
	if IsTriangleWord(triangles, test) {
		t.Errorf("%s should not be a triangle word", test)
	}
}

func TestCountTriangleWords(t *testing.T) {
	test := []string{"WOMAN", "WORLD", "YARD", "WARM"}
	if CountTriangleWords(test) != 2 {
		t.Errorf("should be 2 triangle words in %v", test)
	}
}
func TestIsTriangle(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    int64
		expected bool
	}{
		{"Triangle number", int64(55), true},
		{"Non-triangle number", 56, false},
		{"Negative number", -1, false},
		{"Zero", 0, true},
		{"One", 1, true},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tri := &Triangle{}
			result := tri.IsPolygonal(tc.input)
			if result != tc.expected {
				t.Errorf("IsTriangle(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}
