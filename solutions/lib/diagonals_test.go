package eulerlib

import (
	"testing"
)

func TestDiagonals(t *testing.T) {
	tests := []TTest{
		{
			Name:   "1st iteration",
			Input:  nil,
			Expect: [][]int{{5}, {3}, {7}, {9}},
		},
		{
			Name:   "2nd iteration",
			Input:  nil,
			Expect: [][]int{{5, 17}, {3, 13}, {7, 21}, {9, 25}},
		},
		{
			Name:   "3rd iteration",
			Input:  nil,
			Expect: [][]int{{5, 17, 37}, {3, 13, 31}, {7, 21, 43}, {9, 25, 49}},
		},
	}

	d := &Diagonals{}
	d.Init()

	for _, test := range tests {
		d.Next()
		output := [][]int{d.TopLeft, d.TopRight, d.BottomLeft, d.BottomRight}
		CheckTest(t, "Diagonals", test, output)
	}
}
