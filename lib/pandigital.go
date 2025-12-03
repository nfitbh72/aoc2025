package eulerlib

import (
	"reflect"
	"sort"
)

// GetPandigitalProducts searches all products i*j for i,j in [0, iterations)
// and returns those products whose concatenated digits (i, j, and p) form a
// pandigital set between minPandigital and maxPandigital inclusive.
func GetPandigitalProducts(minPandigital, maxPandigital int, iterations int) []int {
	a := []int{}
	for i := range iterations {
		for j := range iterations {
			p := i * j
			if IsPandigital([]int{i, j, p}, minPandigital, maxPandigital) {
				a = append(a, p)
			}
		}
	}
	return a
}

// IsPandigital reports whether the concatenated digits of numbers form a
// pandigital set containing each digit from min to max exactly once.
func IsPandigital(numbers []int, min, max int) bool {
	compare := make([]int, max-min+1)
	for i := min; i <= max; i++ {
		//fmt.Println(i-1, 1)
		compare[i-min] = i
	}
	d := []int{}
	for _, num := range numbers {
		d = append(d, GetDigitsOfInt(num)...)
	}
	sort.Ints(d)
	return reflect.DeepEqual(d, compare)
}
