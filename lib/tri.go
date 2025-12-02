package eulerlib

import (
	"fmt"
)

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
func (m *Tri) PrintString() {
	fmt.Print(m.Val)
	if m.R != nil {
		fmt.Print(" R - > [")
		m.R.PrintString()
		fmt.Print("] ")
	}
	if m.L != nil {
		fmt.Print(" L -> [")
		m.L.PrintString()
		fmt.Print("] ")
	}
	fmt.Println()
}

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

func IsTriangleWord(triangles map[int]bool, word string) bool {
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
