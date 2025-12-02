package eulerlib

import "testing"

func TestGetAllInt(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Empty Array",
			Input:  "",
			Expect: []int{},
		},
		{
			Name:   "No Asterisk",
			Input:  "35",
			Expect: []int{35},
		},
		{
			Name:   "Single Asterisk",
			Input:  "*",
			Expect: []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
		},
		{
			Name:   "Digit and asterisk",
			Input:  "*3",
			Expect: []int{3, 13, 23, 33, 43, 53, 63, 73, 83, 93},
		},
		{
			Name:   "Digit and asterisk",
			Input:  "*3*",
			Expect: GetIntArrFromDelimitedStr("30 130 230 330 430 530 630 730 830 930 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39 31 32 33 34 35 36 37 38 39", " ", false),
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.TestGetAllInt", test, GetAllInt(test.Input.(string), "*"))
	}
}

func TestGetReplaceSameDigit(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Empty Array",
			Input:  "",
			Expect: []int{},
		},
		{
			Name:   "No Asterisk",
			Input:  "35",
			Expect: []int{35},
		},
		{
			Name:   "Single Asterisk",
			Input:  "*",
			Expect: []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
		},
		{
			Name:   "Digit and asterisk",
			Input:  "*3",
			Expect: []int{13, 23, 33, 43, 53, 63, 73, 83, 93},
		},
		{
			Name:   "Digit and asterisk",
			Input:  "*3*",
			Expect: []int{131, 232, 333, 434, 535, 636, 737, 838, 939},
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.GetReplaceSameDigit", test, GetReplaceSameDigit(test.Input.(string), "*"))
	}
}

func TestGetMatchesSameDigit(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Empty String with isPrime",
			Input:  "",
			Expect: []int{},
		},
		{
			Name:   "No Asterisk, is prime",
			Input:  "37",
			Expect: []int{37},
		},
		{
			Name:   "No Asterisk, is not prime",
			Input:  "32",
			Expect: []int{},
		},
		{
			Name:   "Single Asterisk, some are prime",
			Input:  "*",
			Expect: []int{2, 3, 5, 7},
		},
		{
			Name:   "Digit and asterisk, some are prime",
			Input:  "*3",
			Expect: []int{13, 23, 43, 53, 73, 83},
		},
		{
			Name:   "Digit and two asterisks, some are prime",
			Input:  "56**3",
			Expect: []int{56003, 56113, 56333, 56443, 56663, 56773, 56993},
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.GetMatches (sameDigit == true)", test, GetWildcardMatches(
			test.Input.(string), "*", true, IsPrime,
		))
	}
}

func TestGetMatchesAll(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Empty String with isPrime",
			Input:  "",
			Expect: []int{},
		},
		{
			Name:   "No Asterisk, is prime",
			Input:  "37",
			Expect: []int{37},
		},
		{
			Name:   "No Asterisk, is not prime",
			Input:  "32",
			Expect: []int{},
		},
		{
			Name:   "Single Asterisk, some are prime",
			Input:  "*",
			Expect: []int{2, 3, 5, 7},
		},
		{
			Name:   "Digit and asterisk, some are prime",
			Input:  "*3",
			Expect: []int{3, 13, 23, 43, 53, 73, 83},
		},
		{
			Name:   "Digit and two asterisks, some are prime",
			Input:  "56**3",
			Expect: GetIntArrFromDelimitedStr("56003 56503 56053 56093 56053 56093 56053 56093 56053 56093 56053 56093 56053 56093 56053 56093 56053 56093 56053 56093 56053 56093", " ", false),
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.GetMatches (sameDigit == false)", test, GetWildcardMatches(
			test.Input.(string), "*", false, IsPrime,
		))
	}

}

func TestGetWildcardPermsOfNumber(t *testing.T) {
	tests := []TTest{
		{
			Name:   "SingleDigit",
			Input:  5,
			Expect: []string{"5", "*"},
		},
		{
			Name:   "TwoDigit",
			Input:  53,
			Expect: []string{"53", "*3", "5*", "**"},
		},
		{
			Name:   "ThreeDigit",
			Input:  123,
			Expect: []string{"123", "*23", "1*3", "**3", "12*", "*2*", "1**", "***"},
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"wildcard.GetWildcardPermsOfNumber true, true",
			test,
			GetWildcardPermsOfNumber(test.Input.(int), true, true),
		)
	}
}

func TestGetWildcardPermsOfNumberNoOriginal(t *testing.T) {
	tests := []TTest{
		{
			Name:   "SingleDigit",
			Input:  5,
			Expect: []string{"*"},
		},
		{
			Name:   "TwoDigit",
			Input:  53,
			Expect: []string{"*3", "5*", "**"},
		},
		{
			Name:   "ThreeDigit",
			Input:  123,
			Expect: []string{"*23", "1*3", "**3", "12*", "*2*", "1**", "***"},
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.GetWildcardPermsOfNumber false, true", test, GetWildcardPermsOfNumber(test.Input.(int), false, true))
	}
}

func TestGetWildcardPermsOfNumberNoAllReplacements(t *testing.T) {
	tests := []TTest{
		{
			Name:   "SingleDigit",
			Input:  5,
			Expect: []string{"5"},
		},
		{
			Name:   "TwoDigit",
			Input:  53,
			Expect: []string{"53", "*3", "5*"},
		},
		{
			Name:   "ThreeDigit",
			Input:  123,
			Expect: []string{"123", "*23", "1*3", "**3", "12*", "*2*", "1**"},
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.GetWildcardPermsOfNumber true, false", test, GetWildcardPermsOfNumber(test.Input.(int), true, false))
	}
}

func TestGetWildcardPermsOfNumberNoOriginalNoAllReplacements(t *testing.T) {
	tests := []TTest{
		{
			Name:   "SingleDigit",
			Input:  5,
			Expect: []string{},
		},
		{
			Name:   "TwoDigit",
			Input:  53,
			Expect: []string{"*3", "5*"},
		},
		{
			Name:   "ThreeDigit",
			Input:  123,
			Expect: []string{"*23", "1*3", "**3", "12*", "*2*", "1**"},
		},
	}
	for _, test := range tests {
		CheckTest(t, "wildcard.GetWildcardPermsOfNumber false, false", test, GetWildcardPermsOfNumber(test.Input.(int), false, false))
	}
}
