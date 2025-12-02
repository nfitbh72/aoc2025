package eulerlib

import (
	"math/big"
	"reflect"
	"testing"
)

func TestFibonacciNext(t *testing.T) {
	tests := []TTest{
		{
			Name:   "Testing Next Sequence is accurate",
			Input:  6,
			Expect: []int{1, 1, 2, 3, 5, 8},
		},
	}
	for _, test := range tests {
		t.Run(test.Name, func(t *testing.T) {
			fib := FibonacciSequence{}
			out := []int{}
			for range test.Input.(int) {
				out = append(out, fib.Next())
			}
			if !reflect.DeepEqual(out, test.Expect) {
				t.Errorf("Expected %v, got %v", test.Expect, out)
			}
			currentExpect := test.Expect.([]int)[len(test.Expect.([]int))-1]
			if fib.Current() != currentExpect {
				t.Errorf("Expected %v, got %v", currentExpect, fib.Current())
			}
		})
	}
}

func TestGetSumOfEvenFibonacciNumbersBelow(t *testing.T) {
	fib := FibonacciSequence{}
	tests := []TTest{
		{
			Name:   "Testing Sum of Even Fibonacci Numbers Below 10",
			Input:  10,
			Expect: 10,
		},
		{
			Name:   "Testing Sum of Even Fibonacci Numbers Below 100",
			Input:  100,
			Expect: 44,
		},
		{
			Name:   "Testing Sum of Even Fibonacci Numbers Below 4,000,000",
			Input:  4000000,
			Expect: 4613732,
		},
	}
	for _, test := range tests {
		t.Run(test.Name, func(t *testing.T) {
			out := SumConditionalFibonacciBelow(test.Input.(int), IsEven)
			if out != test.Expect {
				t.Errorf("Expected %v, got %v", test.Expect, out)
			}
			fib.Reset()
		})
	}
}
func TestGetFibonacci(t *testing.T) {

	tests := []struct {
		name     string
		length   int
		expected []int
	}{
		{
			name:     "Length 0",
			length:   0,
			expected: []int{},
		},
		{
			name:     "Length 1",
			length:   1,
			expected: []int{1},
		},
		{
			name:     "Length 2",
			length:   2,
			expected: []int{1, 1},
		},
		{
			name:     "Length 5",
			length:   5,
			expected: []int{1, 1, 2, 3, 5},
		},
		{
			name:     "Length 8",
			length:   8,
			expected: []int{1, 1, 2, 3, 5, 8, 13, 21},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetFibonacci(tt.length)

			// Check length
			if len(result) != len(tt.expected) {
				t.Errorf("GetFibonacci(%d) returned slice of length %d, want %d",
					tt.length, len(result), len(tt.expected))
			}

			// Check contents
			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("GetFibonacci(%d) = %v, want %v",
					tt.length, result, tt.expected)
			}
		})
	}
}

// Test negative input
func TestGetFibonacci_NegativeInput(t *testing.T) {
	result := GetFibonacci(-1)
	if len(result) != 0 {
		t.Errorf("GetFibonacci(-1) = %v, want empty slice", result)
	}
}

func TestGetBigFibonacci(t *testing.T) {
	tests := []struct {
		name     string
		length   int
		expected []*big.Int
	}{
		{
			name:     "Empty sequence for negative length",
			length:   -1,
			expected: []*big.Int{},
		},
		{
			name:     "Zero length sequence",
			length:   0,
			expected: []*big.Int{},
		},
		{
			name:   "Length 1 sequence",
			length: 1,
			expected: []*big.Int{
				big.NewInt(1),
			},
		},
		{
			name:   "Length 2 sequence",
			length: 2,
			expected: []*big.Int{
				big.NewInt(1),
				big.NewInt(1),
			},
		},
		{
			name:   "Length 5 sequence",
			length: 5,
			expected: []*big.Int{
				big.NewInt(1),
				big.NewInt(1),
				big.NewInt(2),
				big.NewInt(3),
				big.NewInt(5),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetBigFibonacci(tt.length)

			// Check length
			if len(result) != len(tt.expected) {
				t.Errorf("Length mismatch: got %v, want %v", len(result), len(tt.expected))
				return
			}

			// Check each value
			for i := 0; i < len(result); i++ {
				if result[i].Cmp(tt.expected[i]) != 0 {
					t.Errorf("Value mismatch at index %d: got %v, want %v",
						i, result[i].String(), tt.expected[i].String())
				}
			}
		})
	}
}

// Helper function to test very large Fibonacci numbers
func TestGetBigFibonacci_LargeNumbers(t *testing.T) {

	// Test the 100th Fibonacci number
	result := GetBigFibonacci(100)

	// The 100th Fibonacci number is known
	expected := new(big.Int)
	expected.SetString("354224848179261915075", 10)

	if result[99].Cmp(expected) != 0 {
		t.Errorf("100th Fibonacci number mismatch: got %v, want %v",
			result[99].String(), expected.String())
	}
}

// Test consecutive numbers property
func TestGetBigFibonacci_ConsecutiveNumbers(t *testing.T) {

	length := 10
	result := GetBigFibonacci(length)

	for i := 2; i < length; i++ {
		sum := new(big.Int).Add(result[i-2], result[i-1])
		if result[i].Cmp(sum) != 0 {
			t.Errorf("Fibonacci property failed at index %d: %v != %v + %v",
				i, result[i], result[i-2], result[i-1])
		}
	}
}
