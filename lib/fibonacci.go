package eulerlib

import "math/big"

// FibonacciSequence represents a memory-efficient Fibonacci number generator
type FibonacciSequence struct {
	previous int // first number in the pair
	current  int // second number in the pair
}

// Next returns the next number in the Fibonacci sequence
func (f *FibonacciSequence) Next() int {
	if f.current == 0 {
		f.current = 1
		return 1
	}
	if f.previous == 0 {
		f.previous = 1
		return 1
	}

	next := f.previous + f.current
	f.previous = f.current
	f.current = next
	return next
}

// Current returns the last generated Fibonacci number
func (f *FibonacciSequence) Current() int {
	return f.current
}

// Reset resets the sequence to its initial state
func (f *FibonacciSequence) Reset() {
	f.previous = 0
	f.current = 0
}

// SumEvenFibonacciBelow returns the sum of conditional Fibonacci numbers below the given limit
func SumConditionalFibonacciBelow(limit int, condition func(int) bool) int {
	f := &FibonacciSequence{}
	sum := 0

	for num := f.Next(); num < limit; num = f.Next() {
		if condition(num) {
			sum += num
		}
	}
	return sum
}

func GetFibonacci(length int) []int {
	if length < 0 {
		return []int{}
	}
	a := make([]int, length)
	for i := range length {
		if i < 2 {
			a[i] = 1
		} else {
			a[i] = a[i-1] + a[i-2]
		}
	}
	return a
}

func GetBigFibonacci(length int) []*big.Int {
	if length <= 0 {
		return []*big.Int{}
	}
	if length == 1 {
		return []*big.Int{big.NewInt(1)}
	}
	a := make([]*big.Int, length)
	for i := range length {
		if i < 2 {
			a[i] = big.NewInt(1)
		} else {
			a[i] = big.NewInt(0).Add(a[i-1], a[i-2])
		}
	}
	return a
}
