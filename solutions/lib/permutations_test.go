package eulerlib

import (
	"math/big"
	"strings"
	"testing"
)

func TestGetCircularPerms(t *testing.T) {
	perms := TPerms{}
	tests := []TTest{
		{
			Name:   "3 digit number",
			Input:  197,
			Expect: []int{197, 971, 719},
		},
		{
			Name:   "9 digit number",
			Input:  197234624,
			Expect: []int{197234624, 972346241, 723462419, 234624197, 346241972, 462419723, 624197234, 241972346, 419723462},
		},
		{
			Name:   "1 digit number",
			Input:  4,
			Expect: []int{4},
		},
		{
			Name:   "zero",
			Input:  0,
			Expect: []int{0},
		},
	}
	for _, test := range tests {
		CheckTest(t, "permutations.GetCircularPerms", test, perms.GetCircularPerms(test.Input.(int)))
	}

}

func TestInit(t *testing.T) {
	p := &TPerms{}

	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  []int{1, 2, 3},
			Expect: []int{1, 2, 3},
		},
	}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(t, "permutations.Init", test, p.Arr)
	}
}

func TestGetPerms(t *testing.T) {
	p := &TPerms{}
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  []int{1, 2, 3},
			Expect: [][]int{{1, 2, 3}, {1, 3, 2}, {2, 1, 3}, {2, 3, 1}, {3, 2, 1}, {3, 1, 2}},
		},
	}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(t, "permutations.GetPerms", test, p.GetPerms())
	}
}

func TestGetCombinations(t *testing.T) {
	type TGetCombinationsArgs struct {
		a    []int
		size int
	}
	p := &TPerms{}
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  TGetCombinationsArgs{a: []int{1, 2, 3}, size: 2},
			Expect: [][]int{{1, 2}, {1, 3}, {2, 3}},
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"permutations.GetCombinations",
			test,
			p.GetCombinations(test.Input.(TGetCombinationsArgs).a, test.Input.(TGetCombinationsArgs).size),
		)
	}
}

func TestGetUniqueCombinations(t *testing.T) {
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  []int{1, 2, 3},
			Expect: [][]int{{1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}},
		},
	}
	p := &TPerms{}
	for _, test := range tests {
		CheckTest(
			t,
			"permutations.GetUniqueCombinations",
			test,
			p.GetUniqueCombinations(test.Input.([]int)),
		)
	}
}

func TestGetMultipleCombinations(t *testing.T) {
	type TGetMultipleCombinationsArgs struct {
		a         []int
		maxOfEach int
	}
	p := &TPerms{}
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  TGetMultipleCombinationsArgs{a: []int{1, 2, 3}, maxOfEach: 1},
			Expect: [][]int{{1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}},
		},
	}
	for _, test := range tests {
		p.Init(test.Input.(TGetMultipleCombinationsArgs).a)
		CheckTest(
			t,
			"permutations.GetMultipleCombinations",
			test,
			p.GetMultipleCombinations(test.Input.(TGetMultipleCombinationsArgs).maxOfEach),
		)
	}
}

func TestNextPerm(t *testing.T) {
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  []int{1, 2, 3},
			Expect: []int{1, 2, 3},
		},
		{
			Name:   "3 int slice",
			Input:  []int{},
			Expect: []int{},
		},
	}
	p := &TPerms{}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(
			t,
			"permutations.NextPerm",
			test,
			p.NextPerm(),
		)
	}
}

func TestGetAllPermsAsStrings(t *testing.T) {
	p := &TPerms{}
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  []int{1, 2, 3},
			Expect: []string{"123", "132", "213", "231", "321", "312"},
		},
	}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(t, "permutations.GetAllPermsAsStrings", test, p.GetAllPermsAsStrings())
	}
}

func TestGetAllPermsAsInts(t *testing.T) {
	p := &TPerms{}
	tests := []TTest{
		{
			Name:   "3 int slice",
			Input:  []int{1, 2, 3},
			Expect: []int{123, 132, 213, 231, 321, 312},
		},
	}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(t, "permutations.GetAllPermsAsInts", test, p.GetAllPermsAsInts())
	}
}

func TestGetCountCombinatorics(t *testing.T) {
	bigValTest := big.NewInt(0)
	bigValTest, _ = bigValTest.SetString("100891344545564193334812497256", 10)
	tests := []TTest{
		{
			Name:   "(5 3) == 10)",
			Input:  []int{5, 3},
			Expect: big.NewInt(10),
		},
		{
			Name:   "(23 10) == 1144066",
			Input:  []int{23, 10},
			Expect: big.NewInt(1144066),
		},
		{
			Name:   "(23 10) == 1144066",
			Input:  []int{100, 50},
			Expect: bigValTest,
		},
	}
	p := &TPerms{}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(t, "permutations.GetCountCombinatorics", test, p.GetCountCombinatorics(
			test.Input.([]int)[0], test.Input.([]int)[1],
		))
	}
}
func TestGetPotentialRecurringStrings(t *testing.T) {
	p := &TPerms{}

	tests := []TTest{
		{
			Name:   "Empty string",
			Input:  "",
			Expect: []string{},
		},
		{
			Name:   "Single character",
			Input:  "a",
			Expect: []string{},
		},
		{
			Name:      "Two characters",
			Input:     "ab",
			Expect:    []string{"b"},
			Unordered: true,
		},
		{
			Name:      "Four characters",
			Input:     "1234",
			Expect:    []string{"4", "34", "3"},
			Unordered: true,
		},
		{
			Name:      "Repeating pattern",
			Input:     "123123",
			Expect:    []string{"3", "23", "123", "1", "12", "2"},
			Unordered: true,
		},
		{
			Name:      "Repeating pattern with non-recurring characters",
			Input:     "123123abc",
			Expect:    strings.Split("2 23 23a 23ab 23abc 3 3a 3ab 3abc a ab abc b bc c", " "),
			Unordered: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			result := p.getPotentialRecurringStrings(tt.Input.(string))
			CheckTest(t, "permutations.getPotentialRecurringStrings", tt, result)
		})
	}
}

// Test for specific edge cases
func TestGetPotentialRecurringStringsEdgeCases(t *testing.T) {
	p := &TPerms{}

	// Test with a very long string
	longString := strings.Repeat("a", 1000)
	result := p.getPotentialRecurringStrings(longString)
	if len(result) == 0 {
		t.Error("Expected non-empty result for long string")
	}

	// Test with special characters
	specialChars := "!@#$%^&*()"
	result = p.getPotentialRecurringStrings(specialChars)
	expectedLength := 15 // 15 unique substrings for special characters
	if len(result) != expectedLength {
		t.Errorf("Special characters test: got length %v, want %v",
			len(result), expectedLength)
	}
}

func TestGetFingerprint(t *testing.T) {

	p := &TPerms{}

	tests := []TTest{
		{
			Name:   "Empty string",
			Input:  "",
			Expect: "",
		},
		{
			Name:   "Single character",
			Input:  "a",
			Expect: "a",
		},
		{
			Name:   "Two characters",
			Input:  "ab",
			Expect: "ab",
		},
		{
			Name:   "Four characters",
			Input:  "1234",
			Expect: "1234",
		},
		{
			Name:   "Repeating pattern",
			Input:  "123123",
			Expect: "112233",
		},
		{
			Name:   "Repeating pattern with non-recurring characters",
			Input:  "123abc123",
			Expect: "112233abc",
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			result := p.GetFingerprint(tt.Input.(string))
			CheckTest(t, "permutations.getFingerprint", tt, result)
		})
	}
}

func TestTMath_IsRecurringString(t *testing.T) {
	p := &TPerms{}

	tests := []struct {
		name     string
		subject  string
		test     string
		expected bool
	}{
		{
			name:     "Simple recurring pattern",
			subject:  "123123123",
			test:     "123",
			expected: true,
		},
		{
			name:     "No recurring pattern",
			subject:  "12345",
			test:     "123",
			expected: false,
		},
		{
			name:     "Empty test string",
			subject:  "12345",
			test:     "",
			expected: false,
		},
		{
			name:     "Empty subject string",
			subject:  "",
			test:     "123",
			expected: false,
		},
		{
			name:     "Single character recurring",
			subject:  "1111",
			test:     "1",
			expected: true,
		},
		{
			name:     "Test string longer than subject",
			subject:  "123",
			test:     "1234",
			expected: false,
		},
		{
			name:     "Partial match but not recurring",
			subject:  "123124123",
			test:     "123",
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := p.isRecurringString(tt.subject, tt.test)
			if result != tt.expected {
				t.Errorf("isRecurringString(%q, %q) = %v; want %v",
					tt.subject, tt.test, result, tt.expected)
			}
		})
	}
}

func TestGetSmallestRecurringNumberSize(t *testing.T) {
	p := &TPerms{}

	tests := []TTest{
		{
			Name:   "Simple recurring decimal 1/3",
			Input:  "0.333333333333",
			Expect: "3",
		},
		{
			Name:   "Recurring decimal 1/6",
			Input:  "0.166666666666",
			Expect: "6",
		},
		{
			Name:   "Smallest recurring pattern 1/7",
			Input:  "0.14285714285714285714285714",
			Expect: "142857",
		},
		{
			Name:   "Non-recurring decimal",
			Input:  "0.25",
			Expect: "",
		},
		{
			Name:   "Empty decimal",
			Input:  "",
			Expect: "",
		},
		{
			Name:   "Integer only",
			Input:  "42",
			Expect: "",
		},
		{
			Name:   "weird",
			Input:  "0.00100100",
			Expect: "001",
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			bf := GetBigFloatFromStr(tt.Input.(string))
			got := p.GetSmallestRecurringNumber(bf)
			if got != tt.Expect {
				t.Errorf("GetSmallestRecurringNumberSize() = %v, want %v", got, tt.Expect)
			}
		})
	}
	if p.GetSmallestRecurringNumber(nil) != "0" {
		t.Errorf("GetSmallestRecurringNumberSize() = %v, want %v", p.GetSmallestRecurringNumber(nil), "0")
	}
}

func TestIsRecurringString(t *testing.T) {
	p := &TPerms{}

	tests := []struct {
		name     string
		subject  string
		test     string
		expected bool
	}{
		{
			name:     "Simple recurring pattern",
			subject:  "333333",
			test:     "3",
			expected: true,
		},
		{
			name:     "Non-recurring pattern",
			subject:  "12345",
			test:     "12",
			expected: false,
		},
		{
			name:     "Empty test string",
			subject:  "333333",
			test:     "",
			expected: false,
		},
		{
			name:     "Empty subject string",
			subject:  "",
			test:     "3",
			expected: false,
		},
		{
			name:     "Test string longer than subject",
			subject:  "333",
			test:     "3333",
			expected: false,
		},
		{
			name:     "Complex recurring pattern",
			subject:  "142857142857",
			test:     "142857",
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := p.isRecurringString(tt.subject, tt.test)
			if got != tt.expected {
				t.Errorf("isRecurringString() = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestGetUniquePerms(t *testing.T) {
	p := &TPerms{}
	tests := []TTest{
		{
			Name:  "3 int slice",
			Input: []int{1, 2, 3},
			Expect: map[int]bool{
				123: true, 132: true, 213: true, 231: true, 321: true, 312: true,
			},
		},
	}
	for _, test := range tests {
		p.Init(test.Input.([]int))
		CheckTest(t, "permutations.GetUniquePerms", test, p.GetUniquePerms(false))
	}
}
