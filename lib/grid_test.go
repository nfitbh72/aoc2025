package eulerlib

import (
	"fmt"
	"testing"
)

func TestRowInit(t *testing.T) {
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  nil,
			Expect: []int{},
		},
	}
	for _, test := range tests {
		r.Init()
		CheckTest(t, "row.Init", test, r.Values)
	}
}

func TestRowInitCount(t *testing.T) {
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  4,
			Expect: []int{0, 0, 0, 0},
		},
	}
	for _, test := range tests {
		r.InitCount(test.Input.(int))
		CheckTest(t, "row.InitCount", test, r.Values)
	}
}

func TestRowParseRow(t *testing.T) {
	type TParseRowArgs struct {
		rowStr    string
		delimiter string
	}
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  TParseRowArgs{rowStr: "1 2 3 4", delimiter: " "},
			Expect: []int{1, 2, 3, 4},
		},
	}
	for _, test := range tests {
		r.Init()
		r.ParseRow(test.Input.(TParseRowArgs).rowStr, test.Input.(TParseRowArgs).delimiter)
		CheckTest(t, "row.ParseRow", test, r.Values)
	}
}

func TestRowParseSpaceDRow(t *testing.T) {
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  "1 2 3 4",
			Expect: []int{1, 2, 3, 4},
		},
	}
	for _, test := range tests {
		r.Init()
		r.ParseSpaceDRow(test.Input.(string))
		CheckTest(t, "row.ParseSpaceDRow", test, r.Values)
	}
}

func TestRowAdd(t *testing.T) {
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  1,
			Expect: []int{1},
		},
	}
	for _, test := range tests {
		r.Init()
		r.Add(test.Input.(int))
		CheckTest(t, "row.Add", test, r.Values)
	}
}

func TestRowGetMaxValue(t *testing.T) {
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  nil,
			Expect: 0,
		},
		{
			Name:   "4-element-row",
			Input:  []int{1, 2, 3, 4},
			Expect: 4,
		},
	}
	for _, test := range tests {
		r.Init()
		if test.Input != nil {
			r.Values = test.Input.([]int)
		}
		max := r.GetMaxValue()
		CheckTest(t, "row.GetMaxValue", test, max)
	}

}

func TestCopy(t *testing.T) {
	r := &TRow{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  1,
			Expect: []int{1},
		},
	}
	for _, test := range tests {
		r.Init()
		r.Add(test.Input.(int))
		copy := r.Copy()
		//blank the original, make sure that the copy doesn't change
		r.Values = []int{}
		CheckTest(t, "row.Copy", test, copy.Values)
	}
}

func TestTableInit(t *testing.T) {
	table := &TTable{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  nil,
			Expect: []TRow{},
		},
	}
	for _, test := range tests {
		table.Init()
		CheckTest(t, "row.Init", test, table.Rows)
	}
}

func TestTableParseTable(t *testing.T) {
	type TTableParseRowArgs struct {
		lines     []string
		delimiter string
	}
	table := &TTable{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  TTableParseRowArgs{lines: []string{"1 2 3", "4 5 6"}, delimiter: " "},
			Expect: []TRow{{Values: []int{1, 2, 3}}, {Values: []int{4, 5, 6}}},
		},
	}
	for _, test := range tests {
		table.Init()
		table.ParseTable(test.Input.(TTableParseRowArgs).lines, test.Input.(TTableParseRowArgs).delimiter)
		CheckTest(t, "row.ParseTable", test, table.Rows)
	}
}

func TestTableMergeAllRows(t *testing.T) {
	type TTableParseRowArgs struct {
		lines     []string
		delimiter string
	}
	table := &TTable{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  TTableParseRowArgs{lines: []string{"1 2 3", "4 5 6"}, delimiter: " "},
			Expect: []TRow{{Values: []int{1, 2, 3, 4, 5, 6}}, {Values: []int{}}},
		},
	}
	for _, test := range tests {
		table.Init()
		table.ParseTable(test.Input.(TTableParseRowArgs).lines, test.Input.(TTableParseRowArgs).delimiter)
		table.MergeAllRows()
		CheckTest(t, "table.MergeAllRows", test, table.Rows)
	}
}

func TestTableGetSumOfMaxOfEachRow(t *testing.T) {
	table := &TTable{}
	table.Init()
	tests := []TTest{
		{
			Name:   "[1, 2, 3], [4, 5, 6]",
			Input:  []TRow{{Values: []int{1, 2, 3}}, {Values: []int{4, 5, 6}}},
			Expect: 9,
		},
	}
	for _, test := range tests {
		table.Rows = test.Input.([]TRow)
		sum := table.GetSumOfMaxOfEachRow()
		CheckTest(t, "table.GetSumOfMaxOfEachRow", test, sum)
	}

}

func TestGridInit(t *testing.T) {
	g := &TGrid{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  nil,
			Expect: [][]any{},
		},
	}
	for _, test := range tests {
		g.Init()
		CheckTest(t, "grid.Init", test, g.Values)
	}
}

func TestGridGetIntRow(t *testing.T) {
	g := &TGrid{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  "1234",
			Expect: []any{1, 2, 3, 4},
		},
	}
	for _, test := range tests {
		g.Init()
		CheckTest(t, "grid.GetIntRow", test, g.GetIntRow(test.Input.(string)))
	}
}

func TestGridGetStrRow(t *testing.T) {
	g := &TGrid{}
	tests := []TTest{
		{
			Name:   "nil",
			Input:  "1234",
			Expect: []any{'1', '2', '3', '4'},
		},
	}
	for _, test := range tests {
		g.Init()
		CheckTest(t, "grid.GetStrRow", test, g.GetStrRow(test.Input.(string)))
	}
}

func TestParseSpaceDTable(t *testing.T) {
	g := &TGrid{}
	g.Init()
	type TParseSpaceDTableArgs struct {
		lines    []string
		forceInt bool
	}
	tests := []TTest{
		{
			Name: "lines as int",
			Input: TParseSpaceDTableArgs{
				lines:    []string{"1 2 3", "4 5 6"},
				forceInt: true,
			},
			Expect: [][]any{{1, 2, 3}, {4, 5, 6}},
		},
		{
			Name: "lines as runes",
			Input: TParseSpaceDTableArgs{
				lines:    []string{"1 2 3", "4 5 6"},
				forceInt: false,
			},
			Expect: [][]any{{"1", "2", "3"}, {"4", "5", "6"}},
		},
	}
	for _, test := range tests {
		g.Init()
		g.ParseSpaceDTable(
			test.Input.(TParseSpaceDTableArgs).lines,
			test.Input.(TParseSpaceDTableArgs).forceInt,
		)
		CheckTest(t, "grid.ParseSpaceDTable", test, g.Values)
	}
}

func TestParseTable(t *testing.T) {
	g := &TGrid{}
	g.Init()
	type TParseTableArgs struct {
		lines    []string
		forceInt bool
	}
	tests := []TTest{
		{
			Name: "lines as int",
			Input: TParseTableArgs{
				lines:    []string{"123", "456"},
				forceInt: true,
			},
			Expect: [][]any{{1, 2, 3}, {4, 5, 6}},
		},
		{
			Name: "lines as runes",
			Input: TParseTableArgs{
				lines:    []string{"123", "456"},
				forceInt: false,
			},
			Expect: [][]any{{'1', '2', '3'}, {'4', '5', '6'}},
		},
	}
	for _, test := range tests {
		g.Init()
		g.ParseTable(
			test.Input.(TParseTableArgs).lines,
			test.Input.(TParseTableArgs).forceInt,
		)
		CheckTest(t, "grid.ParseTable", test, g.Values)
	}
}

func TestFindElement(t *testing.T) {
	g := &TGrid{}
	g.Init()
	type TParseTableArgs struct {
		lines    []string
		forceInt bool
		element  int
	}
	tests := []TTest{
		{
			Name: "lines as int",
			Input: TParseTableArgs{
				lines:    []string{"123", "456"},
				forceInt: true,
				element:  2,
			},
			Expect: []int{1, 0},
		},
		{
			Name: "lines as int",
			Input: TParseTableArgs{
				lines:    []string{"123", "456"},
				forceInt: true,
				element:  6,
			},
			Expect: []int{2, 1},
		},
	}
	for _, test := range tests {
		g.Init()
		g.ParseTable(
			test.Input.(TParseTableArgs).lines,
			test.Input.(TParseTableArgs).forceInt,
		)
		x, y := g.FindElement(test.Input.(TParseTableArgs).element)
		CheckTest(t, "grid.ParseTable", test, []int{x, y})
	}
}

func TestGridCreateSpiralFromCenter(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.CreateSpiralFromCenter(3, 3)
	expect := [][]int{
		{7, 8, 9},
		{6, 1, 2},
		{5, 4, 3},
	}
	if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", g.Values) {
		t.Errorf("Expect: %v, got: %v", expect, g.Values)
	}
	g.CreateSpiralFromCenter(5, 5)
	expect = [][]int{
		{21, 22, 23, 24, 25},
		{20, 7, 8, 9, 10},
		{19, 6, 1, 2, 11},
		{18, 5, 4, 3, 12},
		{17, 16, 15, 14, 13},
	}
	if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", g.Values) {
		t.Errorf("Expect: %v, got: %v", expect, g.Values)
	}
}

func TestGridCreateAnticlockwiseSpiralFromCenter(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.CreateSpiralFromCenter(3, 3)
	expect := [][]int{
		{7, 8, 9},
		{6, 1, 2},
		{5, 4, 3},
	}
	if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", g.Values) {
		t.Errorf("Expect: %v, got: %v", expect, g.Values)
	}
	g.CreateAnticlockwiseSpiralFromCenter(5, 5)
	expect = [][]int{
		{17, 16, 15, 14, 13},
		{18, 5, 4, 3, 12},
		{19, 6, 1, 2, 11},
		{20, 7, 8, 9, 10},
		{21, 22, 23, 24, 25}}
	if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", g.Values) {
		t.Errorf("Expect: %v, got: %v", expect, g.Values)
	}
}

func TestGridFlipVertical(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseSpaceDTable([]string{"1 2 3", "4 5 6", "7 8 9"}, true)
	expect := [][]int{
		{7, 8, 9},
		{4, 5, 6},
		{1, 2, 3},
	}
	g.FlipVertical()
	if fmt.Sprintf("%v", expect) != fmt.Sprintf("%v", g.Values) {
		t.Errorf("Expect: %v, got: %v", expect, g.Values)
	}

}

func TestSumDiagonals(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.CreateSpiralFromCenter(3, 3)
	expect := 25
	if g.SumDiagonals() != expect {
		t.Errorf("Expect: %v, got: %v", expect, g.SumDiagonals())
	}
	g.CreateSpiralFromCenter(5, 5)
	expect = 101
	if g.SumDiagonals() != expect {
		t.Errorf("Expect: %v, got: %v", expect, g.SumDiagonals())
	}
}

func TestGetDiagonals(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseSpaceDTable([]string{"1 2 3", "4 5 6", "7 8 9"}, true)

	diag1, diag2 := g.GetDiagonals()

	tests := []TTest{
		{
			Name:   "3x3 grid diagonals",
			Input:  nil,
			Expect: [][]int{{1, 5, 9}, {3, 5, 7}},
		},
	}

	for _, test := range tests {
		CheckTest(t, "grid.GetDiagonals", test, [][]int{diag1, diag2})
	}
}

func TestGetUniqueDiagonals(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseSpaceDTable([]string{"1 2 3", "4 5 6", "7 8 9"}, true)

	unique := g.GetUniqueDiagonals()

	tests := []TTest{
		{
			Name:   "3x3 grid unique diagonals",
			Input:  nil,
			Expect: []int{1, 9, 3, 5, 7},
		},
	}

	for _, test := range tests {
		CheckTest(t, "grid.GetUniqueDiagonals", test, unique)
	}
}

func TestGetAllUniqueValues(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseSpaceDTable([]string{"1 2 1", "3 1 3"}, true)

	values := g.GetAllUniqueValues()

	if len(values) != 3 { // 1, 2, 3
		t.Fatalf("expected 3 unique values, got %d", len(values))
	}

	// check value 1
	v1, ok := values[1]
	if !ok {
		t.Fatalf("expected value 1 in map")
	}
	if v1.Count != 3 {
		t.Errorf("expected count 3 for value 1, got %d", v1.Count)
	}
	// check a known location for 1
	found := false
	for _, loc := range v1.Locations {
		if loc[0] == 0 && loc[1] == 0 { // (x=0,y=0)
			found = true
			break
		}
	}
	if !found {
		t.Errorf("expected location (0,0) for value 1, got %v", v1.Locations)
	}

	// check value 2
	if v2, ok := values[2]; !ok || v2.Count != 1 {
		t.Errorf("expected value 2 with count 1, got: %+v, ok=%v", v2, ok)
	}

	// check value 3
	if v3, ok := values[3]; !ok || v3.Count != 2 {
		t.Errorf("expected value 3 with count 2, got: %+v, ok=%v", v3, ok)
	}
}

func TestWalkFromWithBlockerAndBounds(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseTable([]string{"ABC", "D#F"}, false)

	// normal move (no blocker)
	pos := &TGridPosition{X: 0, Y: 0, Direction: RightDirection}
	newPos, err := g.WalkFromWithBlocker(pos, '#')
	if err != nil {
		t.Fatalf("unexpected error on normal move: %v", err)
	}
	if newPos.X != 1 || newPos.Y != 0 {
		t.Errorf("expected new position (1,0), got (%d,%d)", newPos.X, newPos.Y)
	}

	// move into blocker
	pos = &TGridPosition{X: 0, Y: 1, Direction: RightDirection}
	newPos, err = g.WalkFromWithBlocker(pos, '#')
	if err == nil {
		t.Fatalf("expected error when moving into blocker, got nil")
	}
	if newPos.X != 0 || newPos.Y != 1 {
		t.Errorf("expected to remain at (0,1) when blocked, got (%d,%d)", newPos.X, newPos.Y)
	}

	// move out of bounds
	pos = &TGridPosition{X: 2, Y: 0, Direction: RightDirection}
	newPos, err = g.WalkFromWithBlocker(pos, '#')
	if err == nil {
		t.Fatalf("expected error when moving out of bounds, got nil")
	}
	if newPos.X != 2 || newPos.Y != 0 {
		t.Errorf("expected to remain at (2,0) when out of bounds, got (%d,%d)", newPos.X, newPos.Y)
	}
}

func TestGetValueSetValueCountValues(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseSpaceDTable([]string{"1 2", "3 4"}, true)

	gp := &TGridPosition{X: 1, Y: 0, Direction: RightDirection}
	if g.GetValue(gp) != 2 {
		t.Errorf("expected value 2 at (1,0), got %v", g.GetValue(gp))
	}

	g.SetValue(1, 0, 9)
	if g.GetValue(gp) != 9 {
		t.Errorf("expected value 9 at (1,0) after SetValue, got %v", g.GetValue(gp))
	}

	if g.CountValues(9) != 1 {
		t.Errorf("expected CountValues(9) == 1, got %d", g.CountValues(9))
	}
}

func TestSearchHorizontalVerticalDiagonal(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseTable([]string{"ABCD", "EFGH", "IJKL", "MNOP"}, false)

	if g.SearchHorizantal("ABCD") != 1 {
		t.Errorf("expected 1 horizontal match for 'ABCD'")
	}
	if g.SearchHorizantal("DCBA") != 1 {
		t.Errorf("expected 1 horizontal match for 'DCBA' (reversed)")
	}
	if g.SearchVertical("AEIM") != 1 {
		t.Errorf("expected 1 vertical match for 'AEIM'")
	}
	if g.SearchVertical("MIEA") != 1 {
		t.Errorf("expected 1 vertical match for 'MIEA' (reversed)")
	}

	// diagonal down-right from (0,0): A, F, K, P
	if g.SearchDiagonal("AFKP") != 1 {
		t.Errorf("expected 1 diagonal match for 'AFKP'")
	}
	if g.SearchDiagonal("PKFA") != 1 {
		t.Errorf("expected 1 diagonal match for 'PKFA' (reversed)")
	}

	// diagonal down-left from (3,0): D, G, J, M (covered by second loop)
	if g.SearchDiagonal("DGJM") != 1 {
		t.Errorf("expected 1 diagonal match for 'DGJM' (down-left)")
	}
}

func wordsToStrings(words [][]any) []string {
	res := make([]string, len(words))
	for i, w := range words {
		b := make([]rune, len(w))
		for j, v := range w {
			b[j] = v.(rune)
		}
		res[i] = string(b)
	}
	return res
}

func TestGetAllWordDirections(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseTable([]string{"ABC", "DEF", "GHI"}, false)

	// Horizontal
	h := wordsToStrings(g.GetAllHorizontal(3))
	expectH := []string{"ABC", "CBA", "DEF", "FED", "GHI", "IHG"}
	if fmt.Sprintf("%v", h) != fmt.Sprintf("%v", expectH) {
		t.Errorf("GetAllHorizontal got %v, expect %v", h, expectH)
	}

	// Vertical
	v := wordsToStrings(g.GetAllVertical(3))
	expectV := []string{"ADG", "GDA", "BEH", "HEB", "CFI", "IFC"}
	if fmt.Sprintf("%v", v) != fmt.Sprintf("%v", expectV) {
		t.Errorf("GetAllVertical got %v, expect %v", v, expectV)
	}

	// Diagonal1 (top-left to bottom-right)
	d1 := wordsToStrings(g.GetAllDiagonal1(3))
	expectD1 := []string{"AEI", "IEA"}
	if fmt.Sprintf("%v", d1) != fmt.Sprintf("%v", expectD1) {
		t.Errorf("GetAllDiagonal1 got %v, expect %v", d1, expectD1)
	}

	// Diagonal2 (top-right to bottom-left)
	d2 := wordsToStrings(g.GetAllDiagonal2(3))
	expectD2 := []string{"CEG", "GEC"}
	if fmt.Sprintf("%v", d2) != fmt.Sprintf("%v", expectD2) {
		t.Errorf("GetAllDiagonal2 got %v, expect %v", d2, expectD2)
	}

	// All words combined
	all := wordsToStrings(g.GetAllWords(3))
	// just verify counts: 6 horiz + 6 vert + 2 diag1 + 2 diag2 = 16
	if len(all) != 16 {
		t.Errorf("expected 16 total words from GetAllWords, got %d", len(all))
	}
}

func TestFindElementNotFound(t *testing.T) {
	g := &TGrid{}
	g.Init()
	g.ParseTable([]string{"12", "34"}, true)

	x, y := g.FindElement(9)
	if x != -1 || y != -1 {
		t.Errorf("expected (-1,-1) for missing element, got (%d,%d)", x, y)
	}
}

func TestGridPositionHelpers(t *testing.T) {
	gp := &TGridPosition{X: 1, Y: 2, Direction: RightDirection}

	// NextPos should move one step in current direction
	nx, ny := gp.NextPos()
	if nx != 2 || ny != 2 {
		t.Errorf("NextPos expected (2,2), got (%d,%d)", nx, ny)
	}

	// ChangeDirection and NextPos again
	gp.ChangeDirection(DownDirection)
	nx, ny = gp.NextPos()
	if nx != 1 || ny != 3 {
		t.Errorf("NextPos after ChangeDirection expected (1,3), got (%d,%d)", nx, ny)
	}

	// ToString should contain coordinates and direction string
	s := gp.ToString()
	if s == "" || s == "0, 0: " {
		t.Errorf("unexpected ToString output: %q", s)
	}
}

// Additional coverage for functions requested to reach 100%

func TestRowGetMaxValueNilSlice(t *testing.T) {
	r := &TRow{}
	// r.Values is nil here
	if got := r.GetMaxValue(); got != 0 {
		t.Errorf("expected 0 for nil Values, got %d", got)
	}
}

func TestGridCreateSpiralFromCenterEvenSizePanics(t *testing.T) {
	g := &TGrid{}
	g.Init()
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("expected panic for even-sized spiral, got none")
		}
	}()

	// both dimensions even should trigger the panic branch
	g.CreateSpiralFromCenter(4, 4)
}

func TestSearchDiagonalNoMatchAdditionalPath(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// 4x4 grid of letters; use a pattern that does not exist to
	// exercise search loops without hitting the equality branch
	g.ParseTable([]string{"ABCD", "EFGH", "IJKL", "MNOP"}, false)

	if got := g.SearchDiagonal("ZZZZ"); got != 0 {
		t.Errorf("expected 0 diagonal matches for 'ZZZZ', got %d", got)
	}
}

func TestGridToString(t *testing.T) {
	// int grid
	g := &TGrid{}
	g.Init()
	g.ParseSpaceDTable([]string{"1 2", "3 4"}, true)

	expectInt := "1 2 \n3 4 \n"
	if s := g.ToString(); s != expectInt {
		t.Errorf("ToString int grid: expect %q, got %q", expectInt, s)
	}

	// rune grid
	g = &TGrid{}
	g.Init()
	g.ParseTable([]string{"AB", "CD"}, false)

	expectRune := "A B \nC D \n"
	if s := g.ToString(); s != expectRune {
		t.Errorf("ToString rune grid: expect %q, got %q", expectRune, s)
	}
}

func TestGetAdjacentCount(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// Create a 3x3 grid:
	// X O X
	// O X O
	// X O X
	g.ParseTable([]string{"XOX", "OXO", "XOX"}, false)

	// Test center position (1,1) - should have 8 neighbors, 4 X's and 4 O's
	if count := g.GetAdjacentCount(1, 1, 'X'); count != 4 {
		t.Errorf("center position (1,1) expected 4 X's, got %d", count)
	}
	if count := g.GetAdjacentCount(1, 1, 'O'); count != 4 {
		t.Errorf("center position (1,1) expected 4 O's, got %d", count)
	}

	// Test corner position (0,0) - should have 3 neighbors: O, O, X
	if count := g.GetAdjacentCount(0, 0, 'O'); count != 2 {
		t.Errorf("corner position (0,0) expected 2 O's, got %d", count)
	}
	if count := g.GetAdjacentCount(0, 0, 'X'); count != 1 {
		t.Errorf("corner position (0,0) expected 1 X, got %d", count)
	}

	// Test edge position (1,0) - should have 5 neighbors
	if count := g.GetAdjacentCount(1, 0, 'X'); count != 3 {
		t.Errorf("edge position (1,0) expected 3 X's, got %d", count)
	}
	if count := g.GetAdjacentCount(1, 0, 'O'); count != 2 {
		t.Errorf("edge position (1,0) expected 2 O's, got %d", count)
	}

	// Test with character that doesn't exist
	if count := g.GetAdjacentCount(1, 1, 'Z'); count != 0 {
		t.Errorf("expected 0 Z's around (1,1), got %d", count)
	}
}

func TestGetAdjacentCountAllSame(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// Create a 3x3 grid of all A's
	g.ParseTable([]string{"AAA", "AAA", "AAA"}, false)

	// Center position should have 8 A's
	if count := g.GetAdjacentCount(1, 1, 'A'); count != 8 {
		t.Errorf("center in all-A grid expected 8 A's, got %d", count)
	}

	// Corner should have 3 A's
	if count := g.GetAdjacentCount(0, 0, 'A'); count != 3 {
		t.Errorf("corner in all-A grid expected 3 A's, got %d", count)
	}

	// Edge should have 5 A's
	if count := g.GetAdjacentCount(1, 0, 'A'); count != 5 {
		t.Errorf("edge in all-A grid expected 5 A's, got %d", count)
	}
}

func TestGetAdjacentCountSingleCell(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// 1x1 grid
	g.ParseTable([]string{"X"}, false)

	// Only cell has no neighbors
	if count := g.GetAdjacentCount(0, 0, 'X'); count != 0 {
		t.Errorf("single cell grid expected 0 adjacent X's, got %d", count)
	}
}

func TestGetAdjacentCountLargerGrid(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// Create a 5x5 grid with a pattern
	g.ParseTable([]string{
		"ABCDE",
		"FGHIJ",
		"KLMNO",
		"PQRST",
		"UVWXY",
	}, false)

	// Test center position (2,2) - M surrounded by H,I,J,L,N,Q,R,S
	if count := g.GetAdjacentCount(2, 2, 'M'); count != 0 {
		t.Errorf("expected 0 M's around (2,2), got %d", count)
	}

	// Count specific adjacent characters
	if count := g.GetAdjacentCount(2, 2, 'H'); count != 1 {
		t.Errorf("expected 1 H around (2,2), got %d", count)
	}
	if count := g.GetAdjacentCount(2, 2, 'R'); count != 1 {
		t.Errorf("expected 1 R around (2,2), got %d", count)
	}
}

func TestGetAdjacentList(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// Create a 3x3 grid:
	// X O X
	// O X O
	// X O X
	g.ParseTable([]string{"XOX", "OXO", "XOX"}, false)

	// Test center position (1,1) - should have 4 X's at corners
	xList := g.GetAdjacentList(1, 1, 'X')
	if len(xList) != 4 {
		t.Errorf("center position (1,1) expected 4 X coordinates, got %d", len(xList))
	}
	// Verify the coordinates are correct (corners)
	expectedX := [][]int{{0, 0}, {2, 0}, {0, 2}, {2, 2}}
	for _, expected := range expectedX {
		found := false
		for _, coord := range xList {
			if coord[0] == expected[0] && coord[1] == expected[1] {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("expected coordinate (%d,%d) not found in X list: %v", expected[0], expected[1], xList)
		}
	}

	// Test center position (1,1) - should have 4 O's at edges
	oList := g.GetAdjacentList(1, 1, 'O')
	if len(oList) != 4 {
		t.Errorf("center position (1,1) expected 4 O coordinates, got %d", len(oList))
	}
	expectedO := [][]int{{1, 0}, {0, 1}, {2, 1}, {1, 2}}
	for _, expected := range expectedO {
		found := false
		for _, coord := range oList {
			if coord[0] == expected[0] && coord[1] == expected[1] {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("expected coordinate (%d,%d) not found in O list: %v", expected[0], expected[1], oList)
		}
	}

	// Test corner position (0,0) - should have 2 O's and 1 X
	cornerO := g.GetAdjacentList(0, 0, 'O')
	if len(cornerO) != 2 {
		t.Errorf("corner position (0,0) expected 2 O coordinates, got %d", len(cornerO))
	}

	// Test with character that doesn't exist
	zList := g.GetAdjacentList(1, 1, 'Z')
	if len(zList) != 0 {
		t.Errorf("expected empty list for Z around (1,1), got %v", zList)
	}
}

func TestGetAdjacentListSpecificCoordinates(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// Create a 5x5 grid with a pattern
	g.ParseTable([]string{
		"ABCDE",
		"FGHIJ",
		"KLMNO",
		"PQRST",
		"UVWXY",
	}, false)

	// Test center position (2,2) - M surrounded by H,I,J,L,N,Q,R,S
	// H is at (2,1), so should be in the list
	hList := g.GetAdjacentList(2, 2, 'H')
	if len(hList) != 1 {
		t.Errorf("expected 1 H coordinate around (2,2), got %d", len(hList))
	}
	if len(hList) > 0 && (hList[0][0] != 2 || hList[0][1] != 1) {
		t.Errorf("expected H at (2,1), got (%d,%d)", hList[0][0], hList[0][1])
	}

	// R is at (2,3), so should be in the list
	rList := g.GetAdjacentList(2, 2, 'R')
	if len(rList) != 1 {
		t.Errorf("expected 1 R coordinate around (2,2), got %d", len(rList))
	}
	if len(rList) > 0 && (rList[0][0] != 2 || rList[0][1] != 3) {
		t.Errorf("expected R at (2,3), got (%d,%d)", rList[0][0], rList[0][1])
	}
}

func TestGetAdjacentListEmptyGrid(t *testing.T) {
	g := &TGrid{}
	g.Init()
	// 1x1 grid
	g.ParseTable([]string{"X"}, false)

	// Only cell has no neighbors
	list := g.GetAdjacentList(0, 0, 'X')
	if len(list) != 0 {
		t.Errorf("single cell grid expected empty list, got %v", list)
	}
}
