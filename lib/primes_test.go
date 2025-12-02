package eulerlib

import (
	"fmt"
	"testing"
)

func TestPrimeNext(t *testing.T) {
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
	}
	for _, test := range tests {
		ps := PrimeSequence{currentNumber: test.Input.(int)}
		CheckTest(t, "PrimeSequenceNext", test, ps.Next())
	}
}

func TestPrimeNextCache(t *testing.T) {
	tests := []TTest{
		{
			Name:   "isprime 2",
			Input:  2,
			Expect: true,
		},
		{
			Name:   "isprime 2 again",
			Input:  2,
			Expect: true,
		},
		{
			Name:   "isprime 2 yet again",
			Input:  3,
			Expect: true,
		},
	}
	ps := PrimesCache{}
	ps.Init(10)
	for _, test := range tests {
		CheckTest(t, "PrimeCacheIsPrime", test, ps.IsPrime(test.Input.(int)))
	}
	if ps.CacheHits != 1 {
		t.Errorf("Expected 1 cache hits, got %d", ps.CacheHits)
	}
	ps2 := PrimesCache{cacheSize: 10}
	if ps2.GetCacheSize() != 10 {
		t.Errorf("Expected cache size to be 10, got %d", ps2.GetCacheSize())
	}
	for _, test := range tests {
		CheckTest(t, "PrimeCacheIsPrime", test, ps2.IsPrime(test.Input.(int)))
	}
	if ps2.CacheHits != 1 {
		t.Errorf("Expected 1 cache hits, got %d", ps2.CacheHits)
	}
	ps3 := PrimesCache{}
	ps3.SetCacheMaxSize(1)
	for _, test := range tests {
		CheckTest(t, "PrimeCacheIsPrime", test, ps3.IsPrime(test.Input.(int)))
	}
	if ps3.CacheHits != 1 {
		t.Errorf("Expected 1 cache hits, got %d", ps3.CacheHits)
	}
}

func TestPrimesCacheGetPrimesList(t *testing.T) {
	tests := []TTest{
		{
			Name:   "primes between 10 and 40",
			Input:  []int{12, 40},
			Expect: []int{13, 17, 19, 23, 29, 31, 37},
		},
		{
			Name:   "primes between 12 and 12",
			Input:  []int{12, 12},
			Expect: []int{},
		},
	}
	for _, test := range tests {
		pc := PrimesCache{}
		pc.Init(100)
		CheckTest(t, "GetPrimesList", test, pc.GetPrimesList(test.Input.([]int)[0], test.Input.([]int)[1]))
	}
}

func TestPrimesCacheGetNPrimes(t *testing.T) {
	tests := []TTest{
		{
			Name:   "get first 10 primes",
			Input:  10,
			Expect: []int{2, 3, 5, 7, 11, 13, 17, 19, 23, 29},
		},
		{
			Name:   "get first 0 primes",
			Input:  0,
			Expect: []int{},
		},
	}
	for _, test := range tests {
		pc := PrimesCache{}
		pc.Init(100)
		CheckTest(t, "GetNPrimes", test, pc.GetNPrimes(test.Input.(int)))
	}
}

func TestCompatiblePrimesInit(t *testing.T) {
	tests := []TTest{
		{
			Name:   "init compatible primes",
			Input:  []int{5, 3, 2},
			Expect: 5,
		},
	}
	for _, test := range tests {
		cp := CompatiblePrimes{}
		cp.Init(test.Input.([]int)[0], test.Input.([]int)[1], test.Input.([]int)[2])
		CheckTest(t, "CompatiblePrimesInit", test, cp.numPrimes)
	}
}

func TestCompatiblePrimesIsPrimePairSet(t *testing.T) {
	pc := PrimesCache{}
	pc.Init(100)
	fmt.Println(pc.GetPrimesList(1, 40))
	tests := []TTest{
		{
			Name:   "is prime pair set",
			Input:  []int{7, 3},
			Expect: true,
		},
		{
			Name:   "is not prime pair set",
			Input:  []int{3, 1, 3},
			Expect: false,
		},
	}
	for _, test := range tests {
		cp := CompatiblePrimes{}
		cp.Init(5, 3, 100)
		CheckTest(t, "CompatiblePrimesIsPrimePairSet", test, cp.IsPrimePairSet(test.Input.([]int)))
	}
}

func TestCompatiblePrimesGenerateCompatible(t *testing.T) {
	tests := []TTest{
		{
			Name:   "generate compatible primes",
			Input:  []int{5, 3, 100},
			Expect: [][]int{{3, 7, 11}},
		},
	}
	for _, test := range tests {
		cp := CompatiblePrimes{}
		cp.Init(test.Input.([]int)[0], test.Input.([]int)[1], test.Input.([]int)[2])
		cp.GenerateCompatible()
		CheckTest(t, "CompatiblePrimesGenerateCompatible", test, cp.compatibleArr)
	}
}
