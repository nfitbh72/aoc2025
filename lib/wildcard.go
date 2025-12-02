package eulerlib

import (
	"strings"
)

// not actually needed for p51
func GetAllInt(pattern string, replace string) []int {
	p := pattern
	if p == "" {
		return []int{}
	}
	allStr := make([]string, 0)
	allStr = append(allStr, p)
	for strings.Contains(p, replace) {
		for k, s := range allStr {
			for i := range 10 {
				newStr := strings.Replace(s, replace, IntToStr(i), 1)
				if i == 0 {
					allStr[k] = newStr
					//fmt.Printf("replaced element %d to get %v\n", k, allStr)
				} else {
					allStr = append(allStr, strings.Replace(p, "*", IntToStr(i), 1))
				}
			}
		}
		p = strings.Replace(p, "*", IntToStr(0), 1)

	}
	allInt := make([]int, 0)
	for _, s := range allStr {
		allInt = append(allInt, StrToInt(s))
	}
	return allInt
}

func GetReplaceSameDigit(pattern string, replace string) []int {
	if pattern == "" {
		return []int{}
	}
	allStr := make([]string, 0)
	if !strings.Contains(pattern, replace) {
		allStr = append(allStr, pattern)
	} else {
		for i := range 10 {
			newStr := strings.Replace(pattern, replace, IntToStr(i), -1)
			if len(newStr) == 1 || newStr[0] != '0' {
				allStr = append(allStr, newStr)
			}
		}
	}
	return GetStrArrAsIntArr(allStr)
}

func GetWildcardMatches(pattern string, replace string, sameDigit bool, f func(int) bool) []int {
	m := []int{}
	if sameDigit {
		m = GetReplaceSameDigit(pattern, replace)
	} else {
		m = GetAllInt(pattern, replace)
	}
	a := []int{}
	for _, v := range m {
		if f(v) {
			a = append(a, v)
		}
	}
	return a
}

func GetWildcardPermsOfNumber(n int, includeOriginal, includeAllReplacements bool) []string {
	//input number as a string
	s := IntToStr(n)
	//perms to return
	perms := []string{}

	//range of masks to use
	masks := PowInt(2, len(s))
	if !includeAllReplacements {
		masks -= 1
	}

	//iterate over the masks
	for i := range masks {
		if i > 0 || includeOriginal {
			s2 := ""
			//iterate over the input number string
			for j := range len(s) {
				//fmt.Printf("pow == %d, i == %d, pow&i == %d, %t\n", pow, i, i&pow, (i&pow != 0))
				//if the mask does not match
				if i&PowInt(2, j) == 0 {
					s2 += string(s[j])
				} else {
					s2 += "*"

				}
			}
			//fmt.Printf("adding %s\n", s2)
			perms = append(perms, s2)
		}
	}
	//fmt.Println("returning", perms)
	return perms
}
