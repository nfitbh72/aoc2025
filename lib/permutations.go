package eulerlib

import (
	"math/big"
	"slices"
	"strings"

	"gonum.org/v1/gonum/stat/combin"
)

// given array Arr, somehow get all of the permutations of that array
// dunno what i was thinking and exactly what is in the perms array
// but it does appear to work :)
type TPerms struct {
	Arr   []int
	perms []int
}

func (m *TPerms) nextPerm(p []int) {
	for i := len(p) - 1; i >= 0; i-- {
		if i == 0 || p[i] < len(p)-i-1 {
			p[i]++
			return
		}
		p[i] = 0
	}
}

func (m *TPerms) getPerm(orig, p []int) []int {
	//take a copy of orig
	result := append([]int{}, orig...)
	for i, v := range p {
		//swap the two positions
		result[i], result[i+v] = result[i+v], result[i]
	}
	return result
}

func (m *TPerms) Init(arr []int) {
	m.Arr = arr
	m.perms = make([]int, len(m.Arr))
}

// gets all the permutations of the entire list in different orders
func (m *TPerms) GetPerms() [][]int {
	allPerms := make([][]int, 0)
	for p := make([]int, len(m.Arr)); p[0] < len(p); m.nextPerm(p) {
		allPerms = append(allPerms, m.getPerm(m.Arr, p))
	}
	return allPerms
}

func (m *TPerms) GetFingerprint(i string) string {
	a := GetStrAsArr(i)
	slices.Sort(a)
	return GetStrArrAsString(a)
}

func (m *TPerms) GetUniquePerms(includeZeroPad bool) map[int]bool {
	//get all the permutations of the entire list in different orders
	allPerms := m.GetPerms()
	//now we need to get the unique ones
	uniquePerms := make(map[int]bool)
	for _, v := range allPerms {
		value := GetArrAsInt(v)
		if includeZeroPad || len(IntToStr(value)) == len(m.Arr) {
			uniquePerms[value] = true
		}
	}
	return uniquePerms
}

func (m *TPerms) GetCombinations(a []int, size int) [][]int {
	//fmt.Println("getting combo")
	list := combin.Combinations(len(a), size)
	//fmt.Println("got combo")
	//replace the values with the actual values from a
	for k, v := range list {
		for k2, v2 := range v {
			list[k][k2] = a[v2]
		}
	}
	//fmt.Println(list)
	return list
}

// gets all the permutations of the list e.g. {1,2,3} would be {{1},{2},{3},{1,2},{1,3},{2,3},{1,2,3}}
func (m *TPerms) GetUniqueCombinations(a []int) (combinations [][]int) {
	//get the unique combinations of a
	//we need array of arrays where the inside array is of size 1, 2... len (m.Arr)
	for innerSize := 1; innerSize < len(a); innerSize++ {
		//get all the combinations of size innerSize
		combCombinations := m.GetCombinations(a, innerSize)
		//add them to the combinations
		combinations = append(combinations, combCombinations...)
	}
	combinations = append(combinations, a)
	return combinations
}

func (m *TPerms) GetMultipleCombinations(maxOfEach int) (combinations [][]int) {
	a := make([]int, 0)
	for range maxOfEach {
		a = append(a, m.Arr...)
	}
	//fmt.Println("combo", a)
	return m.GetUniqueCombinations(a)
}

func (m *TPerms) NextPerm() []int {
	if len(m.perms) > 0 && m.perms[0] < len(m.perms) {
		arr := m.getPerm(m.Arr, m.perms)
		m.nextPerm(m.perms)
		return arr
		//return m.nextPerm(p)
	}
	return make([]int, 0)
}

func (m *TPerms) GetAllPermsAsStrings() []string {
	a := m.GetPerms()
	s := make([]string, len(a))
	for i, v := range a {
		s[i] = GetArrAsString(v)
	}
	return s
}

func (m *TPerms) GetAllPermsAsInts() []int {
	a := m.GetPerms()
	returnArr := make([]int, len(a))
	for i, v := range a {
		returnArr[i] = GetArrAsInt(v)
	}
	return returnArr
}

func (m *TPerms) GetCircularPerms(i int) []int {
	a := GetDigitsOfInt(i)
	returnArr := make([]int, len(a))
	returnArr[0] = i
	first := 0
	for j := 1; j < len(a); j++ {
		first, a = a[0], a[1:]
		a = append(a, first)
		returnArr[j] = DigitsToInt(a)
	}
	return returnArr
}

func (m *TPerms) GetCountCombinatorics(n, r int) *big.Int {
	nFact := Factorial(n)
	rFact := Factorial(r)
	nMinusRFact := Factorial(n - r)

	//fmt.Println(nFact.String(), "/ (", rFact.String(), "*", nMinusRFact, ")")

	return nFact.Div(nFact, rFact.Mul(rFact, nMinusRFact))
}

func (m *TPerms) getPotentialRecurringStrings(s string) []string {
	if len(s) <= 1 {
		return []string{}
	}
	smap := make(map[string]bool)

	str := s[len(s)/2:]
	for len(str) > 0 {
		for i := len(str); i > 0; i-- {
			smap[str[:i]] = true
			smap[str[i:]] = true
			//sa = append(sa, str[:i])
			//sa = append(sa, str[i:])
		}
		str = str[:len(str)-1]
	}

	sa := make([]string, 0)
	for k := range smap {
		if len(k) > 0 {
			sa = append(sa, k)
		}
	}
	return sa
}

func (m *TPerms) isRecurringString(subject, test string) bool {
	if len(test) == 0 || len(subject) == 0 || len(test) > len(subject) {
		return false
	}

	// Count how many complete occurrences of test string exist in subject
	count := 0
	for i := 0; i <= len(subject)-len(test); i += len(test) {
		if subject[i:i+len(test)] == test {
			count++
		} else {
			if count > 0 {
				return false // If pattern breaks, it's not recurring
			}
		}
	}
	// To be recurring, we should have at least 2 occurrences
	return count >= 2
}

func (m *TPerms) GetSmallestRecurringNumber(bf *big.Float) string {
	if bf == nil {
		return "0"
	}
	s := GetStrFromBigFloat(bf)
	s = strings.Replace(s, "0.", "", -1)
	//fmt.Println("testing", s)

	sa := m.getPotentialRecurringStrings(s)

	//fmt.Println(sa)

	//123123123123 could be 123 four times or 123123 twice - we want the former
	smallestSubject := ""
	//fmt.Println("testing", s)
	for _, test := range sa {
		//fmt.Println("testing whether", test, "recurs in", s)
		if m.isRecurringString(s, test) {
			//fmt.Println(test, "is recurring")
			if (len(test) < len(smallestSubject) || smallestSubject == "") && len(test) > 0 {
				//fmt.Println("setting smallest test to", test)
				smallestSubject = test
			}
		}
	}
	//fmt.Println("returning", smallestSubject)
	return smallestSubject
}
