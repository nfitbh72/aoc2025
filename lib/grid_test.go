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
	type TTableParseRowArgs struct {
		lines     []string
		delimiter string
	}
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
