package eulerlib

import (
	"math/big"
	"reflect"
	"strings"
	"testing"
)

func TestGetNumMultiples(t *testing.T) {
	//known success cases
	type TTest struct {
		attempts int
		divisors []int
		result   int
	}
	successTests := []TTest{
		{attempts: 5, divisors: []int{2, 5}, result: 6},
		{attempts: 3, divisors: []int{2}, result: 2},
	}

	for _, successTest := range successTests {
		result := GetNumMultiplesDivisibleBy(successTest.attempts, successTest.divisors)
		if result != successTest.result {
			t.Errorf(
				"Expected that in the numbers to %d, with divisors %v, we would expect %d results, instead got %d",
				successTest.attempts, successTest.divisors, successTest.result, result,
			)
		}
	}

	failTests := []TTest{
		{attempts: 5, divisors: []int{2, 5}, result: 7},
		{attempts: 3, divisors: []int{2}, result: 1},
	}

	for _, failTest := range failTests {
		result := GetNumMultiplesDivisibleBy(failTest.attempts, failTest.divisors)
		if result == failTest.result {
			t.Errorf(
				"Expected that in the numbers to %d, with divisors %v, we would NOT expect %d results, actually got %d",
				failTest.attempts, failTest.divisors, failTest.result, result,
			)
		}
	}

}

func TestIsPrime(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is a prime number, expect true",
			Input:  7,
			Expect: true,
		},
		{
			Name:   "Input is not prime number, expect false",
			Input:  8,
			Expect: false,
		},
		{
			Name:   "Input is 0, expect false",
			Input:  0,
			Expect: false,
		},
		{
			Name:   "Input is 1, expect false",
			Input:  1,
			Expect: false,
		},
	}

	for _, test := range tests {
		CheckTest(t, "IsPrime", test, IsPrime(test.Input.(int)))
	}
}

func TestCountPrimes(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is 10, expect 4",
			Input:  []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
			Expect: 4,
		},
	}

	for _, test := range tests {
		CheckTest(t, "CountPrimes", test, CountPrimes(test.Input.([]int)))
	}

}

func TestIsPalindrome(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an even length palindrome, expect true",
			Input:  100001,
			Expect: true,
		},
		{
			Name:   "Input is an odd length palindrome, expect true",
			Input:  10001,
			Expect: true,
		},
		{
			Name:   "Input is not a palindrome, expect false",
			Input:  10002,
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "IsPalindrome", test, IsPalindrome(test.Input.(int)))
	}
}
func TestIsPalindromeBig(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an even length palindrome, expect true",
			Input:  big.NewInt(int64(100001)),
			Expect: true,
		},
		{
			Name:   "Input is an odd length palindrome, expect true",
			Input:  big.NewInt(int64(10001)),
			Expect: true,
		},
		{
			Name:   "Input is not a palindrome, expect false",
			Input:  big.NewInt(int64(10002)),
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "IsPalindrome", test, IsPalindromeBig(test.Input.(*big.Int)))
	}
}

func TestIsPalindromeBinary(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is an even length palindrome, expect true",
			Input:  9,
			Expect: true,
		},
		{
			Name:   "Input is an odd length palindrome, expect true",
			Input:  585,
			Expect: true,
		},
		{
			Name:   "Input is not a palindrome, expect false",
			Input:  10002,
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "IsPalindromeBinary", test, IsPalindromeBinary(test.Input.(int)))
	}

}

func TestHighestPalindromeOfTwoFactors(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 12 and 15",
			Input:  []int{12, 15},
			Expect: 121,
		},
		{
			Name:   "Input is 12 and 160",
			Input:  []int{12, 160},
			Expect: 1661,
		},
	}

	for _, test := range tests {
		CheckTest(t, "HighestPalindromeOfTwoFactors", test, HighestPalindromeOfTwoFactors(test.Input.([]int)[0], test.Input.([]int)[1]))
	}
}

func TestGetSmallestEvenlyDivisibleNumber(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 10",
			Input:  10,
			Expect: 2520,
		},
	}

	for _, test := range tests {
		CheckTest(t, "GetSmallestEvenlyDivisibleNumber", test, GetSmallestEvenlyDivisibleNumber(test.Input.(int)))
	}
}

func TestSumOfSquares(t *testing.T) {
	type TSumOfSquaresArgs struct {
		start int
		end   int
	}

	tests := []TTest{
		{
			Name:   "Input is 5 and 12",
			Input:  TSumOfSquaresArgs{start: 5, end: 12},
			Expect: 620,
		},
	}

	for _, test := range tests {
		i := test.Input.(TSumOfSquaresArgs)
		CheckTest(t, "SumOfSquares", test, SumOfSquares(i.start, i.end))
	}
}

func TestSquareOfSums(t *testing.T) {
	type TSquareOfSumsArgs struct {
		start int
		end   int
	}

	tests := []TTest{
		{
			Name:   "Input is 5 and 12",
			Input:  TSquareOfSumsArgs{start: 5, end: 12},
			Expect: 4624,
		},
	}

	for _, test := range tests {
		i := test.Input.(TSquareOfSumsArgs)
		CheckTest(t, "SquareOfSums", test, SquareOfSums(i.start, i.end))
	}
}

func TestProduct(t *testing.T) {
	type TProductArgs []int

	tests := []TTest{
		{
			Name:   "Input is 5 and 12",
			Input:  TProductArgs{5, 12, 17},
			Expect: 1020,
		},
	}

	for _, test := range tests {
		i := test.Input.(TProductArgs)
		CheckTest(t, "Product", test, Product(i))
	}
}

func TestSum(t *testing.T) {
	type TSumArgs []int

	tests := []TTest{
		{
			Name:   "Input is [5, 12, 17]",
			Input:  TSumArgs{5, 12, 17},
			Expect: 34,
		},
	}

	for _, test := range tests {
		i := test.Input.(TSumArgs)
		CheckTest(t, "Sum", test, Sum(i))
	}
}

func TestSumOfDigits(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Input is 123",
			Input:  123,
			Expect: 6,
		},
		{
			Name:   "Input is 123456789123456",
			Input:  big.NewInt(0),
			Expect: 66,
		},
	}
	//setting the big.Int input of the 2nd test
	tests[1].Input.(*big.Int).SetString("123456789123456", 10)
	for _, test := range tests {
		i := test.Input
		//type is already any to handle int and big.Int
		CheckTest(t, "SumOfDigits", test, SumOfDigits(i))
	}
}

func TestFactorial(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 40",
			Input:  40,
			Expect: big.NewInt(0),
		},
	}
	tests[0].Expect, _ = tests[0].Expect.(*big.Int).SetString("815915283247897734345611269596115894272000000000", 10)
	for _, test := range tests {
		i := test.Input
		CheckTest(t, "Factorial", test, Factorial(i.(int)))
	}
}

func TestGetUniqueDivisors(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 40",
			Input:  40,
			Expect: []int{1, 2, 4, 5, 8, 10, 20},
		},
		{
			Name:   "Input is 15",
			Input:  15,
			Expect: []int{1, 3, 5},
		},
	}

	for _, test := range tests {
		i := test.Input
		CheckTest(t, "GetUniqueDivisors", test, GetUniqueDivisors(i.(int)))
	}
}

func TestIsAmicable(t *testing.T) {
	type TIsAmicableArgs struct {
		a int
		b int
	}

	tests := []TTest{
		{
			Name:   "Input is not amicable",
			Input:  TIsAmicableArgs{a: 12, b: 16},
			Expect: false,
		},
		{
			Name:   "Input is not amicable with 2 identical ints",
			Input:  TIsAmicableArgs{a: 12, b: 12},
			Expect: false,
		},
		{
			Name:   "Input is amicable",
			Input:  TIsAmicableArgs{a: 1184, b: 1210},
			Expect: true,
		},
	}

	for _, test := range tests {
		i := test.Input
		CheckTest(t, "v", test, IsAmicable(i.(TIsAmicableArgs).a, i.(TIsAmicableArgs).b))
	}
}

func TestIsPerfect(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 40",
			Input:  40,
			Expect: false,
		},
		{
			Name:   "Input is 6",
			Input:  6,
			Expect: true,
		},
	}

	for _, test := range tests {
		i := test.Input
		CheckTest(t, "IsPerfect", test, IsPerfect(i.(int)))
	}
}

func TestIsAbundant(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 39, expect false",
			Input:  39,
			Expect: false,
		},
		{
			Name:   "Input is 12, expect true",
			Input:  12,
			Expect: true,
		},
	}

	for _, test := range tests {
		i := test.Input
		CheckTest(t, "IsAbundant", test, IsAbundant(i.(int)))
	}
}

func TestGetAllAbundantNumbersUnder(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Input is 39, expect false",
			Input:  39,
			Expect: []int{12, 18, 20, 24, 30, 36},
		},
	}

	for _, test := range tests {
		i := test.Input
		CheckTest(t, "GetAllAbundantNumbersUnder", test, GetAllAbundantNumbersUnder(i.(int)))
	}
}

func TestEqualAnyTwoSum(t *testing.T) {

	// Test cases
	tests := []struct {
		name     string
		target   int
		numbers  []int
		expected bool
	}{
		{
			name:     "Empty slice",
			target:   10,
			numbers:  []int{},
			expected: false,
		},
		{
			name:     "Single number",
			target:   5,
			numbers:  []int{5},
			expected: false,
		},
		{
			name:     "Two numbers that sum to target",
			target:   10,
			numbers:  []int{4, 6},
			expected: true,
		},
		{
			name:     "Multiple numbers with sum match",
			target:   12,
			numbers:  []int{3, 5, 7, 9},
			expected: true,
		},
		{
			name:     "Multiple numbers without sum match",
			target:   20,
			numbers:  []int{3, 5, 7, 9},
			expected: false,
		},
		{
			name:     "Same number can be used twice",
			target:   10,
			numbers:  []int{5},
			expected: true,
		},
		{
			name:     "Negative numbers",
			target:   0,
			numbers:  []int{-2, 2, -5, 5},
			expected: true,
		},
	}

	// Run all test cases
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := EqualAnyTwoSum(tt.target, tt.numbers)
			if result != tt.expected {
				t.Errorf("EqualAnyTwoSum(%d, %v) = %v; want %v",
					tt.target, tt.numbers, result, tt.expected)
			}
		})
	}
}

func TestGetPrecision(t *testing.T) {

	tests := []struct {
		name           string
		intDigits      int
		fractionDigits int
		expected       uint
	}{
		{
			name:           "Small numbers",
			intDigits:      1,
			fractionDigits: 2,
			expected:       10, // ceil(3 * log2(10))
		},
		{
			name:           "Larger precision",
			intDigits:      3,
			fractionDigits: 5,
			expected:       27, // ceil(8 * log2(10))
		},
		{
			name:           "Zero fraction digits",
			intDigits:      5,
			fractionDigits: 0,
			expected:       17, // ceil(5 * log2(10))
		},
		{
			name:           "Zero integer digits",
			intDigits:      0,
			fractionDigits: 4,
			expected:       14, // ceil(4 * log2(10))
		},
		{
			name:           "Large numbers",
			intDigits:      10,
			fractionDigits: 10,
			expected:       67, // ceil(20 * log2(10))
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetPrecision(tt.intDigits, tt.fractionDigits)
			if result != tt.expected {
				t.Errorf("GetPrecision(%d, %d) = %d; want %d",
					tt.intDigits, tt.fractionDigits, result, tt.expected)
			}
		})
	}
}

// Also test the related GetPrecisionFromStr method
func TestGetPrecisionFromStr(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Simple decimal",
			Input:  "123.45",
			Expect: uint(17), // ceil(5 * log2(10))
		},
		{
			Name:   "Long fraction",
			Input:  "1.123456",
			Expect: uint(24), // ceil(7 * log2(10))
		},
		{
			Name:   "No fraction",
			Input:  "12345.0",
			Expect: uint(20), // ceil(6 * log2(10))
		},
		{
			Name:   "Single digit with fraction",
			Input:  "1.23",
			Expect: uint(10), // ceil(3 * log2(10))
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			result := GetPrecisionFromStr(tt.Input.(string))
			if result != tt.Expect.(uint) {
				t.Errorf("GetPrecisionFromStr(%s) = %d; want %d",
					tt.Input, result, tt.Expect)
			}
		})
	}
}

func TestGetBigFloatFromStr(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Simple integer",
			Input:  "123",
			Expect: "123",
		},
		{
			Name:   "Simple decimal",
			Input:  "123.456",
			Expect: "123.456",
		},
		{
			Name:   "Zero",
			Input:  "0.0",
			Expect: "0",
		},
		{
			Name:   "Large number",
			Input:  "123456789.123456789",
			Expect: "123456789.123456789",
		},
		{
			Name:   "Small decimal",
			Input:  "0.000001",
			Expect: "0.000001",
		},
		{
			Name:   "Negative number",
			Input:  "-123.456",
			Expect: "-123.456",
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			result := GetBigFloatFromStr(tt.Input.(string))
			if result == nil {
				t.Errorf("GetBigFloatFromStr(%s) returned nil", tt.Input)
				return
			}

			// Convert result back to string for comparison
			resultStr := result.Text('f', -1)
			if resultStr != tt.Expect {
				t.Errorf("GetBigFloatFromStr(%s) = %s, want %s",
					tt.Input, resultStr, tt.Expect)
			}
		})
	}
}

// Test error cases separately
func TestGetBigFloatFromStr_InvalidInput(t *testing.T) {

	tests := []struct {
		name  string
		input string
	}{
		{
			name:  "Empty string",
			input: "",
		},
		{
			name:  "Invalid number format",
			input: "abc",
		},
		{
			name:  "Multiple decimal points",
			input: "123.456.789",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetBigFloatFromStr(tt.input)
			// For invalid inputs, we expect a zero value
			expected := "0"
			resultStr := result.Text('f', -1)
			if resultStr != expected {
				t.Errorf("GetBigFloatFromStr(%s) = %s, want %s for invalid input",
					tt.input, resultStr, expected)
			}
		})
	}
}

// Test precision handling
func TestGetBigFloatFromStr_Precision(t *testing.T) {

	tests := []struct {
		name         string
		input        string
		minPrecision uint
	}{
		{
			name:         "High precision decimal",
			input:        "123.456789012345",
			minPrecision: 50, // Expected minimum precision for this number
		},
		{
			name:         "Very large number",
			input:        "123456789012345.123456789012345",
			minPrecision: 100, // Expected minimum precision for this number
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetBigFloatFromStr(tt.input)
			if result == nil {
				t.Errorf("GetBigFloatFromStr(%s) returned nil", tt.input)
				return
			}

			if result.Prec() < tt.minPrecision {
				t.Errorf("GetBigFloatFromStr(%s) precision = %d, want at least %d",
					tt.input, result.Prec(), tt.minPrecision)
			}

			// Verify the string representation matches the input
			resultStr := result.Text('f', -1)
			if !strings.HasPrefix(resultStr, strings.TrimRight(tt.input, "0")) {
				t.Errorf("GetBigFloatFromStr(%s) = %s, lost precision from input",
					tt.input, resultStr)
			}
		})
	}
}

func TestGetStrFromBigFloat(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Simple integer",
			Input:  big.NewFloat(123),
			Expect: "123",
		},
		{
			Name:   "Simple decimal",
			Input:  big.NewFloat(123.456),
			Expect: "123.456",
		},
		{
			Name:   "Zero value",
			Input:  big.NewFloat(0),
			Expect: "0",
		},
		{
			Name:   "Negative number",
			Input:  big.NewFloat(-123.456),
			Expect: "-123.456",
		},
		{
			Name:   "Very small decimal",
			Input:  big.NewFloat(0.000001),
			Expect: "0.000001",
		},
		{
			Name:   "Very large number",
			Input:  new(big.Float).SetPrec(100).SetFloat64(1e20),
			Expect: "100000000000000000000",
		},
		/*
			//not working because we have to case nil to *big.Float
			{
				Name:   "Nil input",
				Input:  nil,
				Expect: "0",
			},
		*/
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			result := GetStrFromBigFloat(tt.Input.(*big.Float))
			if result != tt.Expect {
				t.Errorf("GetStrFromBigFloat(%v) = %s, want %s",
					tt.Input, result, tt.Expect)
			}
		})
	}
	if GetStrFromBigFloat(nil) != "0" {
		t.Errorf("GetStrFromBigFloat(nil) = %s, want %s", GetStrFromBigFloat(nil), "0")
	}
}

// Test precision handling specifically
func TestGetStrFromBigFloat_Precision(t *testing.T) {

	// Create a high-precision number
	highPrecisionNum := new(big.Float).SetPrec(200)
	highPrecisionNum.SetString("123.456789012345678901234567890")

	result := GetStrFromBigFloat(highPrecisionNum)

	// Verify the result maintains significant digits
	if !strings.HasPrefix(result, "123.4567890123") {
		t.Errorf("GetStrFromBigFloat lost precision, got %s", result)
	}
}

// Test scientific notation handling
func TestGetStrFromBigFloat_ScientificNotation(t *testing.T) {

	tests := []TTest{
		{
			Name:   "Very small number",
			Input:  big.NewFloat(1e-10),
			Expect: "0.0000000001",
		},
		{
			Name:   "Very large number",
			Input:  big.NewFloat(1e10),
			Expect: "10000000000",
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			result := GetStrFromBigFloat(tt.Input.(*big.Float))
			if result != tt.Expect {
				t.Errorf("GetStrFromBigFloat(%v) = %s, want %s",
					tt.Input, result, tt.Expect)
			}
		})
	}
}

func TestTMath_BigFloatDivideFloats(t *testing.T) {

	tests := []struct {
		name    string
		f1      float64
		f2      float64
		want    string
		wantErr bool
	}{
		{
			name: "Simple division",
			f1:   10.0,
			f2:   2.0,
			want: "5",
		},
		{
			name: "Division with decimal result",
			f1:   1.0,
			f2:   3.0,
			want: "0.3333333333333335",
		},
		{
			name: "Division by negative number",
			f1:   10.0,
			f2:   -2.0,
			want: "-5",
		},
		{
			name: "Division of zero",
			f1:   0.0,
			f2:   5.0,
			want: "0",
		},
		{
			name: "Division with large numbers",
			f1:   1000000.0,
			f2:   2.0,
			want: "500000",
		},
		{
			name: "Division with small decimals",
			f1:   0.0001,
			f2:   0.0002,
			want: "0.5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := BigFloatDivideFloats(tt.f1, tt.f2, 50)
			if got == nil {
				t.Error("BigFloatDivideFloats returned nil")
				return
			}

			// Convert result to string for comparison
			gotStr := got.Text('f', -1)
			if gotStr != tt.want {
				t.Errorf("BigFloatDivideFloats(%v, %v) = %v, want %v",
					tt.f1, tt.f2, gotStr, tt.want)
			}
		})
	}

	// Test division by zero
	t.Run("Division by zero", func(t *testing.T) {
		got := BigFloatDivideFloats(1.0, 0.0, 10)
		if !got.IsInf() {
			t.Error("Division by zero should return Inf")
		}
	})
}

func TestTMath_BigFloatMultiply(t *testing.T) {

	tests := []struct {
		name     string
		f1       float64
		f2       float64
		expected string
	}{
		{
			name:     "multiply two positive integers",
			f1:       5,
			f2:       3,
			expected: "15",
		},
		{
			name:     "multiply positive and negative numbers",
			f1:       -4,
			f2:       2.5,
			expected: "-10",
		},
		{
			name:     "multiply two decimal numbers",
			f1:       3.14,
			f2:       2.0,
			expected: "6.28",
		},
		{
			name:     "multiply by zero",
			f1:       42,
			f2:       0,
			expected: "0",
		},
		{
			name:     "multiply two large numbers",
			f1:       999999.999,
			f2:       999999.999,
			expected: "999999997999.9999",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := BigFloatMultiply(tt.f1, tt.f2)
			if result.Text('f', -1) != tt.expected {
				t.Errorf("BigFloatMultiply(%v, %v) = %v, want %v",
					tt.f1, tt.f2, result.Text('f', -1), tt.expected)
			}
		})
	}
}

func TestGetNumSequentialPrimesForRemarkablePrimeQuadratic(t *testing.T) {

	tests := []struct {
		name string
		a    int
		b    int
		want int
	}{
		{
			name: "Example from Euler Problem 27 (n² + n + 41)",
			a:    1,
			b:    41,
			want: 40,
		},
		{
			name: "Example from Euler Problem 27 (n² - 79n + 1601)",
			a:    -79,
			b:    1601,
			want: 80,
		},
		{
			name: "Small coefficients",
			a:    1,
			b:    1,
			want: 0,
		},
		{
			name: "Negative coefficients",
			a:    -1,
			b:    -1,
			want: 0,
		},
		{
			name: "Zero coefficients",
			a:    0,
			b:    0,
			want: 0,
		},
		{
			name: "Large positive coefficients",
			a:    999,
			b:    997,
			want: 5,
		},
		{
			name: "Large negative a coefficient",
			a:    -1000,
			b:    997,
			want: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := GetNumSequentialPrimesForRemarkablePrimeQuadratic(tt.a, tt.b)
			if got != tt.want {
				t.Errorf("GetNumSequentialPrimesForRemarkablePrimeQuadratic(%d, %d) = %d; want %d",
					tt.a, tt.b, got, tt.want)
			}
		})
	}
}

// Test edge cases separately
func TestGetNumSequentialPrimesForRemarkablePrimeQuadratic_EdgeCases(t *testing.T) {

	// Test with maximum int32 values
	t.Run("Maximum int32 values", func(t *testing.T) {
		got := GetNumSequentialPrimesForRemarkablePrimeQuadratic(2147483647, 2147483647)
		if got < 0 {
			t.Errorf("Expected non-negative result for maximum values, got %d", got)
		}
	})

	// Test with minimum int32 values
	t.Run("Minimum int32 values", func(t *testing.T) {
		got := GetNumSequentialPrimesForRemarkablePrimeQuadratic(-2147483648, -2147483648)
		if got < 0 {
			t.Errorf("Expected non-negative result for minimum values, got %d", got)
		}
	})
}

// Benchmark test to measure performance
func BenchmarkGetNumSequentialPrimesForRemarkablePrimeQuadratic(b *testing.B) {

	// Run the function b.N times
	for i := 0; i < b.N; i++ {
		GetNumSequentialPrimesForRemarkablePrimeQuadratic(1, 41)
	}
}

func TestBigPowInt(t *testing.T) {

	tests := []struct {
		name     string
		base     *big.Int
		exponent *big.Int
		want     string
	}{
		{
			name:     "Positive base, positive exponent",
			base:     big.NewInt(2),
			exponent: big.NewInt(3),
			want:     "8",
		},
		{
			name:     "Positive base, zero exponent",
			base:     big.NewInt(2),
			exponent: big.NewInt(0),
			want:     "1",
		},
		{
			name:     "Zero base, positive exponent",
			base:     big.NewInt(0),
			exponent: big.NewInt(5),
			want:     "0",
		},
		{
			name:     "Negative base, positive exponent",
			base:     big.NewInt(-3),
			exponent: big.NewInt(2),
			want:     "9",
		},
		{
			name:     "Large positive base, large positive exponent",
			base:     big.NewInt(10),
			exponent: big.NewInt(10),
			want:     "10000000000",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := BigPowInt(tt.base, tt.exponent)
			if got.String() != tt.want {
				t.Errorf("BigPowInt(%d, %d) = %s; want %s",
					tt.base, tt.exponent, got.String(), tt.want)
			}
		})
	}
}

func TestSumList(t *testing.T) {

	tests := []struct {
		name     string
		list     []int
		expected int
	}{
		{
			name:     "Empty list",
			list:     []int{},
			expected: 0,
		},
		{
			name:     "Single element list",
			list:     []int{42},
			expected: 42,
		},
		{
			name:     "Multiple elements list",
			list:     []int{1, 2, 3, 4, 5},
			expected: 15,
		},
		{
			name:     "Negative elements list",
			list:     []int{-1, -2, -3, -4, -5},
			expected: -15,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := SumList(tt.list)
			if got != tt.expected {
				t.Errorf("SumList(%v) = %d; want %d", tt.list, got, tt.expected)
			}
		})
	}

}

func TestSumKeys(t *testing.T) {

	tests := []struct {
		name     string
		m        map[int]bool
		expected int
	}{
		{
			name:     "Empty map",
			m:        map[int]bool{},
			expected: 0,
		},
		{
			name:     "Single element map",
			m:        map[int]bool{1: true},
			expected: 1,
		},
		{
			name:     "Multiple elements map",
			m:        map[int]bool{1: true, 2: true, 3: true},
			expected: 6,
		},
		{
			name:     "Negative elements map",
			m:        map[int]bool{-1: true, -2: true, -3: true},
			expected: -6,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := SumKeys(tt.m)
			if got != tt.expected {
				t.Errorf("SumKeys(%v) = %d; want %d", tt.m, got, tt.expected)
			}
		})
	}
}

func TestIsSumPrimeAndTwiceSquare(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    int
		expected bool
	}{
		{"Sum prime and twice square", 27, true},
		{"Non-sum prime and twice square", 30, false},
		{"Negative number", -1, false},
		{"Zero", 0, false},
		{"One", 1, false},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := IsSumPrimeAndTwiceSquare(tc.input)
			if result != tc.expected {
				t.Errorf("IsSumPrimeAndTwiceSquare(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetUniquePrimeFactors(t *testing.T) {

	// Define test cases
	testCases := []struct {
		name     string
		input    int
		expected []int
	}{
		{"Prime factors", 12, []int{2, 3}},
		{"Prime factors", 15, []int{3, 5}},
		{"Prime factors", 17, []int{}},
		{"Prime factors", 1, []int{}},
		{"Prime factors", 0, []int{}},
		{"Prime factors", -1, []int{}},
		{"Prime factors", 644, []int{2, 7, 23}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := GetUniquePrimeFactors(tc.input)
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetPrimeFactors(%d) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetPrimesOfList(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    []int
		expected []int
	}{
		{"Prime factors", []int{12, 15, 17, 1, 0, -1, 644}, []int{17}},
		{"Prime factors", []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, []int{2, 3, 5, 7}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := GetPrimesOfList(tc.input)
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetPrimesOfList(%v) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetPrimePermutationsEqualInDifference(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    []int
		expected [][]int
	}{
		{"Prime factors", []int{1000, 9999}, [][]int{{1487, 4817, 8147}, {2969, 6299, 9629}}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := GetPrimePermutationsEqualInDifference(tc.input[0], tc.input[1])
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetPrimePermutationsEqualInDifference(%v) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}
}

func TestGetConsecutivePrimeNumbers(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    []int
		expected [][]int
	}{
		{"Prime factors", []int{10, 3}, [][]int{}},
		{"Prime factors", []int{13, 3}, [][]int{{5, 7, 11}, {2, 3, 5, 7}}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {

			result := GetConsecutivePrimeNumbers(tc.input[0], tc.input[1])
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetConsecutivePrimeNumbers(%v) = %v; want %v", tc.input, result, tc.expected)
			}

		})
	}

}

func TestGetPrimesList(t *testing.T) {
	// Create an instance of TMath

	// Define test cases
	testCases := []struct {
		name     string
		input    []int
		expected []int
	}{
		{"Prime factors", []int{2, 10}, []int{2, 3, 5, 7}},
	}

	// Run test cases
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := GetPrimesList(tc.input[0], tc.input[1])
			if !reflect.DeepEqual(result, tc.expected) {
				t.Errorf("GetPrimesList(%v) = %v; want %v", tc.input, result, tc.expected)
			}
		})
	}

}

func TestBigIntMultiply(t *testing.T) {

	type TBigIntMultiplyArgs struct {
		n1 int64
		n2 int64
	}
	tests := []TTest{
		{
			Name:   "two int64",
			Input:  TBigIntMultiplyArgs{n1: 8, n2: 5},
			Expect: big.NewInt(40),
		},
		{
			Name:   "two zeros",
			Input:  TBigIntMultiplyArgs{n1: 0, n2: 0},
			Expect: big.NewInt(0),
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.BigIntMultiply",
			test,
			BigIntMultiply(test.Input.(TBigIntMultiplyArgs).n1, test.Input.(TBigIntMultiplyArgs).n2),
		)
	}
}

func TestGetConsecutiveNumbersWithHighestProduct(t *testing.T) {

	type TGetConsecutiveNumbersWithHighestProductArgs struct {
		a []int
		n int
	}
	tests := []TTest{
		{
			Name:   "two int",
			Input:  TGetConsecutiveNumbersWithHighestProductArgs{a: []int{1, 2, 3, 4, 5, 4, 3, 2}, n: 3},
			Expect: []int{4, 5, 4},
		},
		{
			Name:   "two zeros",
			Input:  TGetConsecutiveNumbersWithHighestProductArgs{a: []int{0, 0, 0}, n: 2},
			Expect: []int{0, 0},
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"lib.GetConsecutiveNumbersWithHighestProduct",
			test,
			GetConsecutiveNumbersWithHighestProduct(
				test.Input.(TGetConsecutiveNumbersWithHighestProductArgs).a,
				test.Input.(TGetConsecutiveNumbersWithHighestProductArgs).n,
			),
		)
	}

}

func TestGetNthPrimeNumber(t *testing.T) {
	tests := []TTest{
		{
			Name:   "10th prime is 29",
			Input:  10,
			Expect: 29,
		},
		{
			Name:   "30th prime is 113",
			Input:  30,
			Expect: 113,
		},
	}
	for _, test := range tests {
		CheckTest(t, "GetNthPrimeNumber", test, GetNthPrimeNumber(test.Input.(int)))
	}
}

func TestGetSumOfPrimesBelow(t *testing.T) {
	tests := []TTest{
		{
			Name:   "sum of primes below 10 is 17",
			Input:  10,
			Expect: 17,
		},
		{
			Name:   "sum of primes below 30 is 129",
			Input:  30,
			Expect: 129,
		},
	}
	for _, test := range tests {
		CheckTest(t, "GetSumOfPrimesBelow", test, GetSumOfPrimesBelow(test.Input.(int)))
	}
}

func TestIsArithmeticSequence(t *testing.T) {
	tests := []TTest{
		{
			Name:   "is arithmetic sequence",
			Input:  []int{1, 2, 3, 4, 5},
			Expect: true,
		},
		{
			Name:   "is arithmetic sequence",
			Input:  []int{1, 3, 5, 7, 9},
			Expect: true,
		},
		{
			Name:   "is not arithmetic sequence",
			Input:  []int{1, 2, 3, 4, 6},
			Expect: false,
		},
		{
			Name:   "is arithmetic sequence",
			Input:  []int{6},
			Expect: true,
		},
	}
	for _, test := range tests {
		CheckTest(t, "IsArithmeticSequence", test, IsArithmeticSequence(test.Input.([]int)))
	}
}

func TestSquareRootCovergents(t *testing.T) {
	tests := []TTest{
		{
			Name:   "1 iteration",
			Input:  1,
			Expect: []*big.Int{big.NewInt(3), big.NewInt(2)},
		},
		{
			Name:   "6th iteration",
			Input:  6,
			Expect: []*big.Int{big.NewInt(239), big.NewInt(169)},
		},
		{
			Name:   "8th iteration",
			Input:  8,
			Expect: []*big.Int{big.NewInt(1393), big.NewInt(985)},
		},
	}
	for _, test := range tests {
		num, den := GetSquareRootCovergents(test.Input.(int))
		output := []*big.Int{num, den}
		CheckTest(t, "GetSquareRootCovergents", test, output)
	}
}

func TestPrimeSequenceNext(t *testing.T) {
	tests := []TTest{
		{
			Name:   "next prime after 0 is 2",
			Input:  0,
			Expect: 2,
		},
		{
			Name:   "next prime after 2 is 3",
			Input:  2,
			Expect: 3,
		},
		{
			Name:   "next prime after 3 is 5",
			Input:  3,
			Expect: 5,
		},
		{
			Name:   "next prime after 29 is 31",
			Input:  29,
			Expect: 31,
		},
	}
	for _, test := range tests {
		ps := PrimeSequence{}
		if test.Input.(int) != 0 {
			ps = PrimeSequence{currentNumber: test.Input.(int)}
		}
		CheckTest(t, "PrimeSequenceNext", test, ps.Next())
	}
}

func TestPrimeSequenceNextWithCondition(t *testing.T) {
	notDivisibleByFive := func(i int) bool {
		return 5*(i/5) != i
	}
	tests := []TTest{
		{
			Name:   "next prime after 2 is 3",
			Input:  2,
			Expect: 3,
		},
		{
			Name:   "next prime after 3 is 5",
			Input:  3,
			Expect: 7, // 5 is skipped because it's divisible by 5
		},
		{
			Name:   "next prime after 29 is 31",
			Input:  29,
			Expect: 31,
		},
	}
	for _, test := range tests {
		ps := PrimeSequence{currentNumber: test.Input.(int)}
		CheckTest(t, "PrimeSequenceNextWithCondition", test, ps.NextWithCondition(notDivisibleByFive))
	}
}
