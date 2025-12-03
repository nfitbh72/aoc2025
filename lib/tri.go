package eulerlib

import (
	"fmt"
)

// Tri represents a node in a numeric triangle, with a value and optional
// left and right child nodes.
type Tri struct {
	Val int
	R   *Tri
	L   *Tri
}

// building a triangle from a 2D list
// e.g. input
// {3}, {7,4}, {2,4,6}
// produces the following:
//
//	    [3]
//	   /   \
//	 [7]   [4]
//	/  \   /  \
//
// [2]  [4]   [6]
func (m *Tri) Init(a [][]int, i, j int) {
	//fmt.Print(".")
	m.Val = a[i][j]
	if i == (len(a) - 1) {
		return
	}
	m.R = &Tri{}
	m.R.Init(a, i+1, j)
	m.L = &Tri{}
	m.L.Init(a, i+1, j+1)
}

// for debug purposes, display the triangle. not recommended for big triangles
func (m *Tri) ToString() string {
	s := fmt.Sprint(m.Val)
	if m.R != nil {
		s += " R - > ["
		s += m.R.ToString()
		s += "] "
	}
	if m.L != nil {
		s += " L -> ["
		s += m.L.ToString()
		s += "] "
	}
	s += "\n"
	return s
}

// globCount tracks how many nodes have been visited while computing maximum
// path sums; it is used only for debug logging.
var globCount = 0

// a maximum path sum algorithm for a binary triangle (tree) structure
// returns the largest path sum of all paths
func (m *Tri) GetTotalMaxPath() int {
	if globCount%1000 == 0 {
		GetDebugger().Log("Count:", globCount)
	}
	globCount++
	if m.L != nil && m.R != nil {
		rTotal := m.R.GetTotalMaxPath()
		lTotal := m.L.GetTotalMaxPath()
		if rTotal > lTotal {
			return m.Val + rTotal
		} else {
			return m.Val + lTotal
		}
	}
	return m.Val
}

// IsTriangleWord reports whether the given word has a letter-value sum that
// appears in the provided set of triangle numbers.
func IsTriangleWord(triangles map[int]bool, word string) bool {
	// IsTriangleWord returns true if the word's letter-value sum is a triangle number.
	total := 0
	//fmt.Print(word, " ")
	for _, s := range word {
		//fmt.Print(int(s)-64, " ")
		total += int(s) - 64
	}
	_, ok := triangles[total]
	//fmt.Println(total, v)
	return ok
}

// CountTriangleWords returns the number of words whose letter-value sums are
// triangle numbers.
func CountTriangleWords(words []string) int {
	triangles := make(map[int]bool)
	for i := range 26 {
		j := i + 1
		triangles[(j+1)*j/2] = true
	}
	//fmt.Println(triangles)
	count := 0
	for _, word := range words {
		if IsTriangleWord(triangles, word) {
			count++
		}
	}
	return count
}
