package eulerlib

import (
	"reflect"
	"sort"
)

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
