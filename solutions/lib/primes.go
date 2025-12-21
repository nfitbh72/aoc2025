package eulerlib

import (
	"slices"
)

// PrimesCache provides a simple integer-prime cache that wraps the global
// IsPrime function and tracks cache hits and misses.
type PrimesCache struct {
	primes      map[int]bool
	cacheSize   int
	CacheHits   int
	CacheMisses int
}

// Init initialises the prime cache with a maximum size and resets hit/miss
// counters.
func (m *PrimesCache) Init(cacheSize int) {
	m.primes = make(map[int]bool)
	m.cacheSize = cacheSize
	m.CacheHits = 0
	m.CacheMisses = 0
}

// IsPrime returns whether n is prime, using an internal cache up to
// cacheSize entries. When the cache is full (and cacheSize > 0) it falls back
// to the global IsPrime function without caching the result.
func (m *PrimesCache) IsPrime(n int) bool {
	if m.primes == nil {
		m.Init(m.cacheSize)
	}

	//if in cache, return from cache
	val, ok := m.primes[n]
	if ok {
		m.CacheHits++
		return val
	}
	m.CacheMisses++

	//if not in cache then check cache size
	//IsPrime is in lib.go
	if m.cacheSize == 0 || len(m.primes) < m.cacheSize {
		//add to cache and return
		v := IsPrime(n)
		m.primes[n] = v
		return v
	} else {
		return IsPrime(n)
	}
}

// SetCacheMaxSize sets the maximum number of entries the prime cache will
// store. A size of 0 disables caching.
func (m *PrimesCache) SetCacheMaxSize(n int) {
	m.cacheSize = n
}

// GetCacheSize returns the current maximum size of the prime cache.
func (m *PrimesCache) GetCacheSize() int {
	return m.cacheSize
}

// GetPrimesList returns all primes in the inclusive range [start, end] using
// the cache-aware IsPrime method.
func (m *PrimesCache) GetPrimesList(start, end int) []int {
	primes := []int{}
	for i := start; i <= end; i++ {
		if m.IsPrime(i) {
			primes = append(primes, i)
		}
	}
	return primes
}

// GetNPrimes returns the first n prime numbers in ascending order, using the
// cache-aware IsPrime method.
func (m *PrimesCache) GetNPrimes(n int) []int {
	primes := []int{}
	i := 2
	for len(primes) < n {
		if m.IsPrime(i) {
			primes = append(primes, i)
		}
		i++
	}
	return primes
}

// CompatiblePrimes searches for sets of primes where every pair of primes
// remains prime when their decimal representations are concatenated in either
// order.
type CompatiblePrimes struct {
	compatibleArr [][]int
	primeCache    *PrimesCache
	perms         *TPerms
	comboLength   int
	numPrimes     int
}

// Init sets up the CompatiblePrimes helper with the number of primes to
// inspect, the desired combination length, and the maximum prime-cache size.
func (m *CompatiblePrimes) Init(numPrimes, comboLength, maxCacheSize int) {
	m.primeCache = &PrimesCache{}
	m.primeCache.SetCacheMaxSize(maxCacheSize)
	m.perms = &TPerms{}
	m.compatibleArr = [][]int{}
	m.comboLength = comboLength
	m.numPrimes = numPrimes
}

// IsPrimePairSet reports whether every ordered pair drawn from ps produces a
// prime when their decimal representations are concatenated in both orders.
func (m *CompatiblePrimes) IsPrimePairSet(ps []int) bool {
	combos := m.perms.GetCombinations(ps, 2)
	//fmt.Println(combos)
	//fmt.Println(combos)
	for _, c := range combos {
		if !m.primeCache.IsPrime(ConcatInts(c[0], c[1])) {
			return false
		}
		if !m.primeCache.IsPrime(ConcatInts(c[1], c[0])) {
			return false
		}
	}
	return true
}

// GenerateCompatible builds the internal list of prime sets where each prime
// is pairwise compatible with the others (all concatenations are prime) and
// returns the number of such sets discovered.
func (m *CompatiblePrimes) GenerateCompatible() int {
	primes := m.primeCache.GetNPrimes(m.numPrimes)
	compatibleMap := map[int][]int{}
	for i := 0; i < len(primes); i++ {
		for j := i + 1; j < len(primes); j++ {
			if primes[i] > 2 && primes[j] > 2 {
				if m.IsPrimePairSet([]int{primes[i], primes[j]}) {
					compatibleMap[primes[i]] = append(compatibleMap[primes[i]], primes[j])
					compatibleMap[primes[j]] = append(compatibleMap[primes[j]], primes[i])
				}
			}
		}
		if i%100 == 0 {
			//fmt.Printf("%d of %d primes checked for compatible; cache has hits %d and misses %d\n", i, len(primes), m.primeCache.CacheHits, m.primeCache.CacheMisses)
		}
	}
	//fmt.Println("compatible primes generated, creating array for easier use")
	//now create an array of compatible combos
	cache := map[string]bool{}
	for p, v := range compatibleMap {
		if len(v) >= m.comboLength-1 {
			a := []int{}
			a = append(a, v...)
			a = append(a, p)
			slices.Sort(a)
			str := ""
			for _, i := range a {
				str += IntToStr(i) + "-"
			}
			_, ok := cache[str]
			if !ok {
				m.compatibleArr = append(m.compatibleArr, a)
			}
		}
	}
	return len(m.compatibleArr)
}

// Search scans the generated compatible prime sets for all unique
// combinations of length comboLength where every pair of primes remains
// compatible, returning each matching combination once.
func (m *CompatiblePrimes) Search() [][]int {
	cache := map[string]bool{}
	cacheHits := 0
	cacheMisses := 0
	maxCombos := 0
	matches := [][]int{}
	i := 0
	for _, v := range m.compatibleArr {
		//fmt.Println("checking", len(v), comboLength)
		if len(v) >= m.comboLength {
			combos := m.perms.GetCombinations(v, m.comboLength)
			if len(combos) > maxCombos {
				maxCombos = len(combos)
			}
			for _, combo := range combos {
				slices.Sort(combo)
				str := ""
				for _, i := range combo {
					str += IntToStr(i) + "-"
				}
				_, ok := cache[str]
				if !ok {
					if m.IsPrimePairSet(combo) {
						matches = append(matches, combo)
						//fmt.Println(combo, SumList(combo))
					}
					cache[str] = true
					cacheMisses++
				} else {
					cacheHits++
				}
			}
		}
		if i%20 == 0 {
			/*
				fmt.Printf(
					"%d of %d searched;\nmy cache hits %d; cache misses %d;\n"+
						"pcache hits: %d; pcache misses: %d;\nmaxCombo: %d\n",
					i, len(m.compatibleArr),
					cacheHits, cacheMisses,
					m.primeCache.CacheHits, m.primeCache.CacheMisses,
					maxCombos,
				)
			*/
			maxCombos = 0
		}
		i++
	}
	//fmt.Println("max combos", maxCombos)
	return matches
}
