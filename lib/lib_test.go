package eulerlib

import (
	"math/big"
	"os"
	"testing"
)

/*
func TestGetAllFromStdIn(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []string{"test", "1", "2", "3", "4", "5", "6"},
			Expect: []string{"1", "2", "3", "4", "5", "6"},
		},
	}
	for _, test := range tests {
		os.Args = test.Input.([]string)
		CheckTest(t, "lib.GetAllFromStdIn", test, GetAllFromStdIn())
	}

}
*/

func TestGetFirstArgAsInt(t *testing.T) {
	test := TTest{
		Name:   "Testing that no arguments causes panic",
		Input:  nil,
		Expect: nil,
	}
	defer func() {
		if r := recover(); r == nil {
			ReportError(t, "lib.GetFirstArgAsInt", test, nil)
		} else {
			ReportSuccess("lib.GetFirstArgAsInt", test)
		}
	}()
	os.Args = []string{"filename"}
	_ = GetFirstArgAsInt()
}

func TestGetFirstArgAsIntPart2(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Argument as integer returns the integer",
			Input:  "123",
			Expect: 123,
		},
		{
			Name:   "Argument as string returns 0",
			Input:  "foo",
			Expect: 0,
		},
	}
	for _, test := range tests {
		os.Args = []string{"filename", test.Input.(string)}
		//fmt.Println("SENDING", os.Args)
		CheckTest(t, "lib.GetFirstArgAsInt", test, GetFirstArgAsInt())
	}
}

func TestIntAbs(t *testing.T) {
	// Create test data to pass into the test
	tests := []TTest{
		{
			Name:   "Input is non-negative",
			Input:  5,
			Expect: 5,
		},
		{
			Name:   "Input is negative (negative value)",
			Input:  -4,
			Expect: 4,
		},
		{
			Name:   "Input is zero",
			Input:  0,
			Expect: 0,
		},
	}

	for _, test := range tests {
		output := IntAbs(test.Input.(int))
		CheckTest(t, "lib.IntAbs", test, output)
	}

}

func TestIntAbs64(t *testing.T) {
	// Create test data to pass into the test
	tests := []TTest{
		{
			Name:   "Input is non-negative",
			Input:  int64(5),
			Expect: int64(5),
		},
		{
			Name:   "Input is negative (negative value)",
			Input:  int64(-4),
			Expect: int64(4),
		},
		{
			Name:   "Input is zero",
			Input:  int64(0),
			Expect: int64(0),
		},
	}

	for _, test := range tests {
		output := Int64Abs(test.Input.(int64))
		CheckTest(t, "lib.IntAbs64", test, output)
	}

}

func TestStrToInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a normal positive integer",
			Input:  "5",
			Expect: 5,
		},
		{
			Name:   "Input is a normal negative integer",
			Input:  "-5",
			Expect: -5,
		},
		{
			Name:   "Input is a zero",
			Input:  "0",
			Expect: 0,
		},
		{
			Name:   "Input is not a number",
			Input:  "foo",
			Expect: 0,
		},
		{
			Name:   "Input is a float",
			Input:  "3.14",
			Expect: 0,
		},
	}

	for _, test := range tests {
		output := StrToInt(test.Input.(string))
		CheckTest(t, "lib.StrToInt", test, output)
	}
}

func TestIntToStr(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a normal positive integer",
			Input:  5,
			Expect: "5",
		},
		{
			Name:   "Input is a normal negative integer",
			Input:  -5,
			Expect: "-5",
		},
		{
			Name:   "Input is a zero",
			Input:  0,
			Expect: "0",
		},
	}

	for _, test := range tests {
		output := IntToStr(test.Input.(int))
		CheckTest(t, "lib.IntToStr", test, output)
	}
}

func TestInt64ToStr(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a normal positive integer",
			Input:  int64(5),
			Expect: "5",
		},
		{
			Name:   "Input is a normal negative integer",
			Input:  int64(-5),
			Expect: "-5",
		},
		{
			Name:   "Input is a zero",
			Input:  int64(0),
			Expect: "0",
		},
	}

	for _, test := range tests {
		CheckTest(t, "lib.IntToStr", test, Int64ToStr(test.Input.(int64)))
	}
}

func TestBigIntToStr(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a big positive integer",
			Input:  big.NewInt(1234567890),
			Expect: "1234567890",
		},
		{
			Name:   "Input is a big negative integer",
			Input:  big.NewInt(-1234567890),
			Expect: "-1234567890",
		},
		{
			Name:   "Input is a big zero integer",
			Input:  big.NewInt(0),
			Expect: "0",
		},
	}
	for _, test := range tests {
		output := BigIntToStr(test.Input.(*big.Int))
		CheckTest(t, "lib.BigIntToStr", test, output)

	}
}

func TestAnyToInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a positive integer as an any",
			Input:  5,
			Expect: 5,
		},
		{
			Name:   "Input is a negative integer as an any",
			Input:  -5,
			Expect: -5,
		},
		{
			Name:   "Input is zero as an any",
			Input:  0,
			Expect: 0,
		},
	}
	for _, test := range tests {
		output := AnyToInt(test.Input)
		CheckTest(t, "lib.AnyToInt", test, output)
	}
}

func TestRuneToInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a simple rune",
			Input:  'K',
			Expect: 27,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.RuneToInt", test, RuneToInt(test.Input.(rune)))
	}
}

func TestReverseString(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a simplestring",
			Input:  "simplestring",
			Expect: "gnirtselpmis",
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.ReverseString", test, ReverseString(test.Input.(string)))
	}
}

func TestShuffle(t *testing.T) {
	test := TTest{
		Name:   "Input is an array of ints",
		Input:  []int{0, 1, 2, 3, 4, 5, 6},
		Expect: "input array in a new order",
	}
	//it is possible for a shuffled array to return the input array, but this is exceedingly unlikely to happen 100 times in a row
	successShuffle := false
	for range 100 {
		input := test.Input.([]int)
		output := Shuffle(input)
		for i := range 7 {
			if input[i] != output[i] {
				successShuffle = true
				break
			}
		}
		if successShuffle {
			break
		}
	}
	if successShuffle {
		ReportSuccess("lib.Shuffle", test)
	} else {
		ReportError(t, "lib.Shuffle", test, test.Input)
	}
}

func TestGetMiddleItem(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is 3-item slice",
			Input:  []int{1, 2, 3},
			Expect: 2,
		},
		{
			Name:   "Input is 4-item slice",
			Input:  []int{1, 2, 3, 4},
			Expect: 3,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetMiddleItem", test, GetMiddleItem(test.Input.([]int)))
	}
}

func TestSliceSwap(t *testing.T) {
	type TSliceSwapInput struct {
		s     []int
		swap1 int
		swap2 int
	}
	tests := []TTest{
		{
			Name: "Input swaps 2nd and 3rd positions of a 4-item slice",
			Input: TSliceSwapInput{
				s:     []int{1, 2, 3, 4},
				swap1: 1,
				swap2: 2,
			},
			Expect: []int{1, 3, 2, 4},
		},
	}
	for _, test := range tests {
		inputCopy := make([]int, len(test.Input.(TSliceSwapInput).s))
		copy(inputCopy, test.Input.(TSliceSwapInput).s)
		//fmt.Println(inputCopy)
		SliceSwap(inputCopy, test.Input.(TSliceSwapInput).swap1, test.Input.(TSliceSwapInput).swap2)
		//note that inputCopy has been altered by the above SliceSwap command
		CheckTest(t, "lib.SliceSwap", test, inputCopy)
	}
}

func TestJoinInts(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a simple int slice",
			Input:  []int{1, 2, 3, 4, 5},
			Expect: "1,2,3,4,5",
		},
		{
			Name:   "Input is an empty int slice",
			Input:  []int{},
			Expect: "",
		},
		{
			Name:   "Input is a single item int slice",
			Input:  []int{42},
			Expect: "42",
		},
	}

	for _, test := range tests {
		CheckTest(t, "lib.JoinInts", test, JoinInts(test.Input.([]int), ","))
	}
}

func TestSliceMultiply(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is empty slice",
			Input:  []int{},
			Expect: 1, // Multiplication identity
		},
		{
			Name:   "Input is single item slice",
			Input:  []int{5},
			Expect: 5,
		},
		{
			Name:   "Input is multiple items with positive numbers",
			Input:  []int{2, 3, 4},
			Expect: 24,
		},
		{
			Name:   "Input includes zero",
			Input:  []int{2, 0, 4},
			Expect: 0,
		},
		{
			Name:   "Input includes negative numbers",
			Input:  []int{2, -3, 4},
			Expect: -24,
		},
		{
			Name:   "Input includes multiple negative numbers",
			Input:  []int{-2, -3, 4},
			Expect: 24,
		},
	}

	for _, test := range tests {
		CheckTest(t, "lib.SliceMultiply", test, SliceMultiply(test.Input.([]int)))
	}
}

func TestIsDivisible(t *testing.T) {
	type TIsDivisibleInput struct {
		num     int
		divisor int
	}
	tests := []TTest{
		{
			Name:   "Input is a divisible number (expect true)",
			Input:  TIsDivisibleInput{num: 8, divisor: 2},
			Expect: true,
		},
		{
			Name:   "Input is NOT a divisible number (expect false)",
			Input:  TIsDivisibleInput{num: 8, divisor: 3},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(
			t, "lib.IsDivisible", test,
			IsDivisible(
				test.Input.(TIsDivisibleInput).num,
				test.Input.(TIsDivisibleInput).divisor,
			),
		)
	}
}

func TestGetAllDivisibles(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a number with a predictable number of divisors",
			Input:  8,
			Expect: []int{1, 2, 4},
		},
		{
			Name:   "Input is a number with a no divisors",
			Input:  1,
			Expect: []int{},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetAllDivisibles", test, GetAllDivisibles(test.Input.(int)))
	}
}

func TestToStringFromRunes(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a number with a predictable number of divisors",
			Input:  []any{'T', 'E', 'S', 'T'},
			Expect: "TEST",
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.ToStringFromRunes", test, ToStringFromRunes(test.Input.([]any)))
	}
}

func TestPowInt(t *testing.T) {
	type TPowInt struct {
		num int
		pow int
	}
	tests := []TTest{
		{
			Name:   "Input is 2^3",
			Input:  TPowInt{num: 2, pow: 3},
			Expect: 8,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.PowInt", test, PowInt(test.Input.(TPowInt).num, test.Input.(TPowInt).pow))
	}
}

func TestConcatInts(t *testing.T) {
	type TConcatIntArgs struct {
		int1 int
		int2 int
	}
	tests := []TTest{
		{
			Name:   "Inputs are two ints",
			Input:  TConcatIntArgs{int1: 123, int2: 456},
			Expect: 123456,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.ConcatInts", test, ConcatInts(test.Input.(TConcatIntArgs).int1, test.Input.(TConcatIntArgs).int2))
	}
}

func TestIsEven(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is even, expect true",
			Input:  8,
			Expect: true,
		},
		{
			Name:   "Input is odd, expect false",
			Input:  9,
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.IsEven", test, IsEven(test.Input.(int)))
	}
}

func TestCollatzSequence(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is 12, expect 9",
			Input:  12,
			Expect: 9,
		},
		{
			Name:   "Input is 120, expect 20",
			Input:  120,
			Expect: 20,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.CollatzSequence", test, CollatzSequence(test.Input.(int)))
	}
}

func TestGetStrArrAsIntArr(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an str array, expect the same array as ints",
			Input:  []string{"1", "23", "456"},
			Expect: []int{1, 23, 456},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetStrArrAsIntArr", test, GetStrArrAsIntArr(test.Input.([]string)))
	}
}

func TestGetLinesAsIntArr(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an str array, expect the same array as ints",
			Input:  []string{"1 2 3", "4 5 6", "7 8 9"},
			Expect: [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetLinesAsIntArr", test, GetLinesAsIntArr(test.Input.([]string)))
	}
}

func TestGetArrFromCommaDelimited(t *testing.T) {
	type TGetArrFromCommaDelimitedArgs struct {
		str      string
		isQuoted bool
	}
	tests := []TTest{
		{
			Name:   "Input is an comma delimited string, expect an array of strings",
			Input:  TGetArrFromCommaDelimitedArgs{str: "1,2,3,42,123", isQuoted: false},
			Expect: []string{"1", "2", "3", "42", "123"},
		},
		{
			Name:   "Input is an comma delimited (and quoted) string, expect an array of strings",
			Input:  TGetArrFromCommaDelimitedArgs{str: "\"1\",\"2\",\"3\",\"42\",\"123\"", isQuoted: true},
			Expect: []string{"1", "2", "3", "42", "123"},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetArrFromCommaDelimited", test, GetArrFromCommaDelimited(
			test.Input.(TGetArrFromCommaDelimitedArgs).str, test.Input.(TGetArrFromCommaDelimitedArgs).isQuoted,
		))
	}
}
func TestGetIntArrFromCommaDelimited(t *testing.T) {
	type TGetArrFromCommaDelimitedArgs struct {
		str       string
		delimiter string
		isQuoted  bool
	}
	tests := []TTest{
		{
			Name:   "Input is an comma delimited string, expect an array of ints",
			Input:  TGetArrFromCommaDelimitedArgs{str: "1,2,3,42,123", isQuoted: false, delimiter: ","},
			Expect: []int{1, 2, 3, 42, 123},
		},
		{
			Name:   "Input is an comma delimited (and quoted) string, expect an array of ints",
			Input:  TGetArrFromCommaDelimitedArgs{str: "\"1\"|\"2\"|\"3\"|\"42\"|\"123\"", isQuoted: true, delimiter: "|"},
			Expect: []int{1, 2, 3, 42, 123},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetIntArrFromDelimitedStr", test, GetIntArrFromDelimitedStr(
			test.Input.(TGetArrFromCommaDelimitedArgs).str, test.Input.(TGetArrFromCommaDelimitedArgs).delimiter, test.Input.(TGetArrFromCommaDelimitedArgs).isQuoted,
		))
	}
}

func TestGetArrAsString(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int array, expecting a string",
			Input:  []int{1, 2, 3, 4, 5, 6},
			Expect: "123456",
		},
		{
			Name:   "Input is an int array with some negative numbers, expecting a string",
			Input:  []int{1, -2, 3, -4, 5, 6},
			Expect: "1-23-456",
		},
		{
			Name:   "Input is an int array with the first item as 0, expecting a string",
			Input:  []int{0, 1, 2, 3, 4, 5, 6},
			Expect: "0123456",
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetArrAsString", test, GetArrAsString(test.Input.([]int)))
	}
}

func TestGetDigitsOfInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int, expecting an array of ints",
			Input:  123456,
			Expect: []int{1, 2, 3, 4, 5, 6},
		},
		{
			Name:   "Input is zero",
			Input:  0,
			Expect: []int{0},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetDigitsOfInt", test, GetDigitsOfInt(test.Input.(int)))
	}
}

func TestGetBinraryDigitsOfInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int, expecting an array of ints",
			Input:  50,
			Expect: []int{1, 1, 0, 0, 1, 0},
		},
		{
			Name:   "Input is zero",
			Input:  0,
			Expect: []int{0},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetBinaryDigitsOfInt", test, GetBinaryDigitsOfInt(test.Input.(int)))
	}
}

func TestGetDigitCount(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int, expecting the number of digits",
			Input:  12223,
			Expect: map[int]int{1: 1, 2: 3, 3: 1},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetDigitCount", test, GetDigitCount(test.Input.(int)))
	}
}

func TestContainsSameDigit(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int, expecting true",
			Input:  []int{12, 26},
			Expect: true,
		},
		{
			Name:   "Input is an int, expecting false",
			Input:  []int{12, 34},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.ContainsSameDigit", test, ContainsSameDigit(test.Input.([]int)[0], test.Input.([]int)[1]))
	}
}

func TestRemoveSameDigit(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int, expecting an int",
			Input:  []int{12, 26},
			Expect: []int{1, 6},
		},
		{
			Name:   "Input is an int, expecting an int",
			Input:  []int{92, 29},
			Expect: []int{0, 0},
		},
	}
	for _, test := range tests {
		i, j := RemoveSameDigit(test.Input.([]int)[0], test.Input.([]int)[1])
		if i != test.Expect.([]int)[0] || j != test.Expect.([]int)[1] {
			ReportError(t, "lib.RemoveSameDigit", test, test.Input)
		}
	}
}

func TestRemoveItemFromList(t *testing.T) {
	//tests are not exhaustive, but are sufficient to show the function works
	tests := []TTest{
		{
			Name:   "Input is an int, expecting an int",
			Input:  []int{12, 26, 34},
			Expect: []int{12, 34},
		},
		{
			Name:   "Input is an int, expecting an int",
			Input:  []int{92},
			Expect: []int{},
		},
		{
			Name:   "Input is an int, expecting an int",
			Input:  []int{},
			Expect: []int{},
		},
	}
	CheckTest(t, "lib.RemoveItemFromList", tests[0], RemoveItemFromList(tests[0].Input.([]int), 1))
	CheckTest(t, "lib.RemoveItemFromList", tests[1], RemoveItemFromList(tests[1].Input.([]int), 0))
	CheckTest(t, "lib.RemoveItemFromList", tests[2], RemoveItemFromList(tests[2].Input.([]int), 0))
}

func TestDigitsToInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []int{1, 2, 3, 4, 5, 6},
			Expect: 123456,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.DigitsToInt", test, DigitsToInt(test.Input.([]int)))
	}

}

func TestIsSameUnorderedList(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int array, expecting an int",
			Input:  [][]int{{1, 2, 3}, {3, 2, 1}},
			Expect: true,
		},
		{
			Name:   "Input is an int array, expecting an int",
			Input:  [][]int{{1, 2, 3}, {1, 2, 3}},
			Expect: true,
		},
		{
			Name:   "Input is an int array, expecting an int",
			Input:  [][]int{{1, 2, 3}, {3, 2, 2}},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.IsSameUnorderedSlice", test, IsSameUnorderedSlice(test.Input.([][]int)[0], test.Input.([][]int)[1]))
	}
}

func TestGetMaxValue(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Empty Array",
			Input:  []int{},
			Expect: 0,
		},
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []int{1, 2, 3, 4, 5, 6},
			Expect: 6,
		},
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []int{1, 6, 3, 4, 6, 0},
			Expect: 6,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetMaxValue", test, GetMaxValue(test.Input.([]int)))
	}
}

func TestContainsSameDigitsAndNumberOfEachDigit(t *testing.T) {
	type TContainsSameDigitsArgs struct {
		n1 int
		n2 int
	}
	tests := []TTest{
		{
			Name:   "two ints with same digits",
			Input:  TContainsSameDigitsArgs{n1: 123, n2: 321},
			Expect: true,
		},
		{
			Name:   "two zeros",
			Input:  TContainsSameDigitsArgs{n1: 0, n2: 0},
			Expect: true,
		},
		{
			Name:   "two ints do not contain same digits",
			Input:  TContainsSameDigitsArgs{n1: 123, n2: 456},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.ContainsSameDigitsAndNumberOfEachDigit",
			test,
			ContainsSameDigitsAndNumberOfEachDigit(test.Input.(TContainsSameDigitsArgs).n1, test.Input.(TContainsSameDigitsArgs).n2),
		)
	}
}

func TestGetAllUniqueValuesMap(t *testing.T) {
	tests := []TTest{
		{
			Name:   "arr with multiple same values",
			Input:  []int{1, 2, 3, 3, 3},
			Expect: map[int]bool{1: true, 2: true, 3: true},
		},
		{
			Name:   "empty list",
			Input:  []int{},
			Expect: map[int]bool{},
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.ContainsSameDigits",
			test,
			GetAllUniqueValuesMap(test.Input.([]int)),
		)
	}
}

func TestContainsSameDigits(t *testing.T) {
	type TContainsSameDigitsArgs struct {
		n1 int
		n2 int
	}
	tests := []TTest{
		{
			Name:   "two ints with same digits",
			Input:  TContainsSameDigitsArgs{n1: 123, n2: 321321},
			Expect: true,
		},
		{
			Name:   "two zeros",
			Input:  TContainsSameDigitsArgs{n1: 0, n2: 0},
			Expect: true,
		},
		{
			Name:   "two ints do not contain same digits",
			Input:  TContainsSameDigitsArgs{n1: 123, n2: 124},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.ContainsSameDigits",
			test,
			ContainsSameDigits(test.Input.(TContainsSameDigitsArgs).n1, test.Input.(TContainsSameDigitsArgs).n2),
		)
	}
}

func TestGetDigitsOfBigInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a big int, expecting an array of ints",
			Input:  big.NewInt(123456),
			Expect: []int{1, 2, 3, 4, 5, 6},
		},
		{
			Name:   "Input is zero",
			Input:  big.NewInt(0),
			Expect: []int{0},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetDigitsOfBigInt", test, GetDigitsOfBigInt(test.Input.(*big.Int)))
	}
}

func TestContainsSameDigitsBig(t *testing.T) {
	type TContainsSameDigitsArgs struct {
		n1 *big.Int
		n2 *big.Int
	}
	tests := []TTest{
		{
			Name:   "two ints with same digits but differently repeated",
			Input:  TContainsSameDigitsArgs{n1: big.NewInt(12332), n2: big.NewInt(3211)},
			Expect: true,
		},
		{
			Name:   "two zeros",
			Input:  TContainsSameDigitsArgs{n1: big.NewInt(0), n2: big.NewInt(0)},
			Expect: true,
		},
		{
			Name:   "two ints do not contain same digits",
			Input:  TContainsSameDigitsArgs{n1: big.NewInt(123), n2: big.NewInt(124)},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.ContainsSameDigitsBig",
			test,
			ContainsSameDigitsBig(test.Input.(TContainsSameDigitsArgs).n1, test.Input.(TContainsSameDigitsArgs).n2),
		)
	}
}

func TestGetListFromMultiLineSpaceDelimited(t *testing.T) {
	//tests are not exhaustive, but are sufficient to show the function works
	tests := []TTest{
		{
			Name:      "Input is an str with newlines and spaces, expecting an int array",
			Input:     []string{"1 2 3\n", "4 5 6\n", "7 8 9"},
			Expect:    []int{1, 2, 3, 4, 5, 6, 7, 8, 9},
			KeyValues: map[string]any{"delimiter": " "},
		},
		{
			Name:      "Input is an str with a single number, expecting an int array",
			Input:     []string{"42\n"},
			Expect:    []int{4, 2},
			KeyValues: map[string]any{"delimiter": ""},
		},
		{
			Name:      "Input is an empty string expecting an int array with zero",
			Input:     []string{""},
			Expect:    []int{},
			KeyValues: map[string]any{"delimiter": ""},
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.GetListFromMultiLineDelimited",
			test,
			GetListFromMultiLineDelimited(test.Input.([]string), test.KeyValues["delimiter"].(string)),
		)
	}
}

func TestContainsSameItems(t *testing.T) {
	//tests are not exhaustive, but are sufficient to show the function works
	tests := []TTest{
		{
			Name:   "Input arrays contain same values, expect true",
			Input:  [][]int{{1, 2, 3}, {3, 2, 1}},
			Expect: true,
		},
		{
			Name:   "Input arrays contain same values, with duplicates, expect true",
			Input:  [][]int{{1, 2, 3, 3}, {1, 2, 1, 2, 3}},
			Expect: true,
		},
		{
			Name:   "Input arrays contain diff values, expect false",
			Input:  [][]int{{1, 2, 3}, {3, 2, 2}},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.ContainsSameItems", test, ContainsSameItems(test.Input.([][]int)[0], test.Input.([][]int)[1]))
	}
}

func TestGetFileInputTxt(t *testing.T) {
	lines := GetFileInputTxt()
	expect := []string{"this is a test", "this is the same test"}
	CheckTest(t, "lib.GetFileInputTxt", TTest{Name: "GetFileInputTxt", Input: nil, Expect: expect}, lines)
}

func TestGetSumAsciiValues(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an str, expecting an int",
			Input:  "abc",
			Expect: 294,
		},
		{
			Name:   "Input is an str, expecting an int",
			Input:  "ABC",
			Expect: 198,
		},
		{
			Name:   "Input is an str, expecting an int",
			Input:  "a",
			Expect: 97,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetSumAsciiValues", test, GetSumAsciiValues(test.Input.(string)))
	}
}

func TestGetIntAsArr(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int, expecting an int array",
			Input:  123456,
			Expect: []int{1, 2, 3, 4, 5, 6},
		},
		{
			Name:   "Input is zero",
			Input:  0,
			Expect: []int{0},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetIntAsArr", test, GetIntAsArr(test.Input.(int)))
	}
}

func TestGetArrAsInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []int{1, 2, 3, 4, 5, 6},
			Expect: 123456,
		},
		{
			Name:   "Input is zero",
			Input:  []int{0},
			Expect: 0,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetArrAsInt", test, GetArrAsInt(test.Input.([]int)))
	}
}

func TestGetAllUniqueStrings(t *testing.T) {
	tests := []TTest{
		{
			Name:      "Input is an array with multiple same values",
			Input:     []string{"a", "b", "c", "a", "b"},
			Expect:    []string{"a", "b", "c"},
			Unordered: true,
		},
		{
			Name:   "Input is an empty array",
			Input:  []string{},
			Expect: []string{},
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetAllUniqueStrings", test, GetAllUniqueStrings(test.Input.([]string)))
	}
}

func TestGetMinValue(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Empty Array",
			Input:  []int{},
			Expect: 0,
		},
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []int{1, 2, 3, 4, 5, 6},
			Expect: 1,
		},
		{
			Name:   "Input is an int array, expecting an int",
			Input:  []int{1, 6, 3, 4, 6, 0},
			Expect: 0,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetMinValue", test, GetMinValue(test.Input.([]int)))
	}
}

func TestGetMinSum(t *testing.T) {
	//tests are not exhaustive, but are sufficient to show the function works
	tests := []TTest{
		{
			Name:   "Same sum arrays",
			Input:  [][]int{{1, 2, 3}, {3, 2, 1}},
			Expect: 6,
		},
		{
			Name:   "identical arrays",
			Input:  [][]int{{1, 2, 3}, {1, 2, 3}},
			Expect: 6,
		},
		{
			Name:   "first array sum smaller",
			Input:  [][]int{{1, 2, 3}, {3, 2, 2}},
			Expect: 6,
		},
		{
			Name:   "second array sum smaller",
			Input:  [][]int{{21, 2, 3}, {3, 2, 2}},
			Expect: 7,
		},
	}
	for _, test := range tests {
		CheckTest(t, "lib.GetMinSum", test, GetMinSum(test.Input.([][]int)))
	}
}
