package eulerlib

import (
	"fmt"
	"log"
	"math"
	"math/big"
	"math/rand/v2"
	"os"
	"reflect"
	"strconv"
	"strings"

	"golang.org/x/exp/slices"
)

func GetFirstArgAsInt() int {
	if len(os.Args) < 2 {
		panic("command line argument required")
	}
	return StrToInt(os.Args[1])
}

// GetFileInputTxt reads the entire contents of the named file and returns a
// slice of lines split on '\n'. On error it logs and returns nil.
func GetFileInputTxt(filename string) []string {
	b, err := os.ReadFile(filename)
	if err != nil {
		log.Println(err)
		return nil
	}
	s := string(b)
	return strings.Split(s, "\n")
}

// IntAbs returns the absolute value of x.
func IntAbs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// Int64Abs returns the absolute value of an int64.
func Int64Abs(x int64) int64 {
	if x < 0 {
		return -x
	}
	return x
}

// StrToInt converts a decimal string to an int, returning 0 on parse error.
func StrToInt(v string) int {
	i, _ := strconv.Atoi(v)
	return i
}

// IntToStr formats an int as its base-10 string representation.
func IntToStr(i int) string {
	return fmt.Sprintf("%d", i)
}

// Int64ToStr formats an int64 as its base-10 string representation.
func Int64ToStr(i int64) string {
	return fmt.Sprintf("%d", i)
}

// BigIntToStr formats a big.Int as a base-10 string.
func BigIntToStr(i *big.Int) string {
	return fmt.Sprintf("%d", i)
}

// AnyToInt asserts that a holds an int and returns it.
func AnyToInt(a any) int {
	return a.(int)
}

// RuneToInt converts a numeric rune ('0'..'9') to its integer value.
func RuneToInt(v rune) int {
	return int(v - '0')
}

// ReverseString returns the input string with runes in reverse order.
func ReverseString(s string) (result string) {
	for _, v := range s {
		result = string(v) + result
	}
	return
}

// ReverseBig returns a new big.Int whose decimal representation is the digit
// reversal of the input value.
func ReverseBig(b *big.Int) *big.Int {
	s := ReverseString(b.String())
	big := big.NewInt(0)
	bigStr, _ := big.SetString(s, 10)
	return bigStr
}

// Shuffle returns a new slice containing the elements of src in random order.
func Shuffle(src []int) []int {
	dest := make([]int, len(src))
	perm := rand.Perm(len(src))
	for i, v := range perm {
		dest[v] = src[i]
	}
	return dest
}

// GetMiddleItem returns the middle element of the slice. For even-length
// slices, it returns the element in the upper half.
func GetMiddleItem(a []int) int {
	//fmt.Println(len(a), len(a)/2)
	return a[len(a)/2]
}

// SliceSwap swaps the elements at indices p1 and p2 in slice a.
func SliceSwap(a []int, p1, p2 int) {
	v := a[p1]
	a[p1] = a[p2]
	a[p2] = v
}

// SliceMultiply returns the product of all elements in the slice. An empty
// slice returns 1.
func SliceMultiply(a []int) int {
	r := 1
	for _, i := range a {
		r = r * i
	}
	return r
}

// IsDivisible reports whether v is evenly divisible by d.
func IsDivisible(v, d int) bool {
	return (d*(v/d) == v)
}

// GetAllDivisibles returns all positive divisors of v less than or equal to
// v/2.
func GetAllDivisibles(v int) []int {
	a := make([]int, 0)
	for i := 1; i <= v/2; i++ {
		if IsDivisible(v, i) {
			a = append(a, i)
		}
	}
	return a
}

// ToStringFromRunes converts a slice of rune-valued anys into a string.
func ToStringFromRunes(runes []any) string {
	str := ""
	for _, r := range runes {
		str += string(r.(rune))
	}
	return str
}

// PowInt computes x raised to the power y as an int.
func PowInt(x, y int) int {
	return int(math.Pow(float64(x), float64(y)))
}

// ConcatInts concatenates the decimal representations of x and y, returning
// the combined value as an int.
func ConcatInts(x, y int) int {
	i := 1
	for i < y {
		i *= 10
	}
	return x*i + y

	//return StrToInt(fmt.Sprintf("%d%d", x, y))
}

// IsEven reports whether i is an even integer.
func IsEven(i int) bool {
	return (2*(i/2) == i)
}

// CollatzSequence returns the length of the Collatz sequence starting at n
// (excluding the final 1).
func CollatzSequence(n int) (count int) {
	count = 0
	for n != 1 {
		if IsEven(n) {
			n = n / 2
		} else {
			n = 3*n + 1
		}
		count++
	}
	return count
}

// GetStrArrAsIntArr converts a slice of decimal strings to a slice of ints.
func GetStrArrAsIntArr(strs []string) []int {
	i := make([]int, 0)
	for _, s := range strs {
		i = append(i, StrToInt(s))
	}
	return i
}

// GetIntAsArr returns the decimal digits of i as a slice of ints.
func GetIntAsArr(i int) []int {
	if i == 0 {
		return []int{0}
	}
	digits := make([]int, 0)
	for i > 0 {
		digits = append(digits, i%10)
		i = i / 10
	}
	slices.Reverse(digits)
	return digits
}

// GetArrAsInt converts a slice of decimal digits into the corresponding int.
func GetArrAsInt(a []int) int {
	i := 0
	for _, d := range a {
		i = i*10 + d
	}
	return i
}

// GetLinesAsIntArr splits each space-delimited string in str into ints,
// returning a 2D slice of parsed values.
func GetLinesAsIntArr(str []string) [][]int {
	i := make([][]int, 0)
	for _, s := range str {
		a := strings.Split(s, " ")
		i = append(i, GetStrArrAsIntArr(a))
	}
	return i
}

// GetIntArrFromDelimitedStr splits s on delimiter d (handling optional
// surrounding quotes when quoted is true) and converts the fields to ints.
func GetIntArrFromDelimitedStr(s string, d string, quoted bool) []int {
	if quoted {
		s = s[1 : len(s)-1]
		//fmt.Println(s)
		return GetStrArrAsIntArr(strings.Split(s, "\""+d+"\""))
	}
	return GetStrArrAsIntArr(strings.Split(s, d))
}

// GetArrFromDelimitedStr splits s on delimiter d, optionally stripping
// surrounding quotes when quoted is true.
func GetArrFromDelimitedStr(s string, d string, quoted bool) []string {
	if quoted {
		s = s[1 : len(s)-1]
		//fmt.Println(s)
		return strings.Split(s, "\""+d+"\"")
	}
	return strings.Split(s, d)
}

// GetArrFromCommaDelimited splits a comma-delimited string into fields,
// delegating to GetArrFromDelimitedStr.
func GetArrFromCommaDelimited(s string, quoted bool) []string {
	return GetArrFromDelimitedStr(s, ",", quoted)
}

// GetStrAsArr converts a string into a slice of single-character strings.
func GetStrAsArr(s string) []string {
	if s == "" {
		return []string{}
	}
	a := make([]string, len(s))
	for k, c := range s {
		a[k] = string(c)
	}
	return a
}

// GetStrArrAsString concatenates all elements of a slice of strings.
func GetStrArrAsString(a []string) string {
	s := ""
	for _, v := range a {
		s += v
	}
	return s
}

// GetArrAsString converts a slice of ints to their concatenated decimal
// representation.
func GetArrAsString(a []int) string {
	s := ""
	for _, v := range a {
		s += IntToStr(v)
	}
	return s
}

// GetDigitsOfInt returns the decimal digits of i as a slice of ints.
func GetDigitsOfInt(i int) []int {
	if i == 0 {
		return []int{0}
	}
	digits := make([]int, 0)
	for i > 0 {
		digits = append(digits, i%10)
		i = i / 10
	}
	slices.Reverse(digits)
	return digits
}

// GetBinaryDigitsOfInt returns the binary digits of i as a slice of ints.
func GetBinaryDigitsOfInt(i int) []int {
	if i == 0 {
		return []int{0}
	}
	digits := make([]int, 0)
	for i > 0 {
		digits = append(digits, i%2)
		i = i / 2
	}
	slices.Reverse(digits)
	return digits
}

// GetDigitCount returns a map from digit to the number of times it appears
// in the decimal representation of i.
func GetDigitCount(i int) map[int]int {
	digits := GetDigitsOfInt(i)
	digitCount := make(map[int]int)
	for _, d := range digits {
		digitCount[d]++
	}
	return digitCount
}

// ContainsSameDigit reports whether two ints share any digit with the same
// frequency.
func ContainsSameDigit(i, j int) bool {
	digitCountI := GetDigitCount(i)
	digitCountJ := GetDigitCount(j)
	for k, v := range digitCountI {
		if digitCountJ[k] == v {
			return true
		}
	}
	return false
}

// DigitsToInt converts a slice of decimal digits into the corresponding int.
func DigitsToInt(a []int) int {
	i := 0
	for _, d := range a {
		i = i*10 + d
	}
	return i
}

// RemoveItemFromList returns a copy of l with the element at index removed.
func RemoveItemFromList(l []int, index int) []int {
	if len(l) == 0 {
		return l
	}
	return append(l[:index], l[index+1:]...)
}

// JoinInts joins the decimal representations of ints in a with the provided
// separator.
func JoinInts(a []int, separator string) string {
	s := ""
	for k, v := range a {
		s += IntToStr(v)
		if k < len(a)-1 {
			s += separator
		}
	}
	return s
}

// IsSameUnorderedSlice reports whether two int slices contain the same
// elements, disregarding order.
func IsSameUnorderedSlice(a1, a2 []int) bool {
	slices.Sort(a1)
	slices.Sort(a2)
	return reflect.DeepEqual(a1, a2)
}

// IsSameUnorderedStringSlice reports whether two string slices contain the
// same elements, disregarding order.
func IsSameUnorderedStringSlice(a1, a2 []string) bool {
	slices.Sort(a1)
	slices.Sort(a2)
	return reflect.DeepEqual(a1, a2)
}

// RemoveSameDigit removes matching digits from two ints and returns the
// remaining values reconstructed from their remaining digits.
func RemoveSameDigit(i, j int) (int, int) {
	digitsI := GetDigitsOfInt(i)
	digitsJ := GetDigitsOfInt(j)
	if IsSameUnorderedSlice(digitsI, digitsJ) {
		return 0, 0
	}
	for ki, di := range digitsI {
		for kj, dj := range digitsJ {
			if di == dj {
				digitsI = RemoveItemFromList(digitsI, ki)
				digitsJ = RemoveItemFromList(digitsJ, kj)
				//i = i - di*PowInt(10, len(GetDigitsOfInt(i))-1)
				//j = j - dj*PowInt(10, len(GetDigitsOfInt(j))-1)
				break
			}
		}
	}
	return DigitsToInt(digitsI), DigitsToInt(digitsJ)
}

// GetDistinct returns a copy of a with duplicate rows removed.
func GetDistinct(a [][]int) [][]int {
	distinct := make([][]int, 0)
	for _, v := range a {
		anyFound := false
		for _, d := range distinct {
			if reflect.DeepEqual(v, d) {
				anyFound = true
				break
			}
		}
		if !anyFound {
			distinct = append(distinct, v)
		}
	}
	return distinct
}

// GetMaxValue returns the largest value in the slice, or 0 if empty.
func GetMaxValue(values []int) int {
	max := 0
	for _, v := range values {
		if v > max {
			max = v
		}
	}
	return max
}

// ContainsSameDigitsAndNumberOfEachDigit reports whether two ints have
// identical multi-sets of digits.
func ContainsSameDigitsAndNumberOfEachDigit(n1, n2 int) bool {
	digits1 := GetDigitsOfInt(n1)
	digits2 := GetDigitsOfInt(n2)
	slices.Sort(digits1)
	slices.Sort(digits2)
	return reflect.DeepEqual(digits1, digits2)
}

// GetAllUniqueValuesMap builds a set-like map of the values present in a.
func GetAllUniqueValuesMap(a []int) map[int]bool {
	uniqueValues := make(map[int]bool)
	for _, v := range a {
		uniqueValues[v] = true
	}
	return uniqueValues
}

// GetAllUniqueStrings returns the unique strings from s in unspecified order.
func GetAllUniqueStrings(s []string) []string {
	uniqueStrings := make([]string, 0)
	uniqueValues := make(map[string]bool)
	for _, v := range s {
		uniqueValues[v] = true
	}
	for k := range uniqueValues {
		uniqueStrings = append(uniqueStrings, k)
	}
	return uniqueStrings
}

// GetAllUniqueValues64Map builds a set-like map of the int64 values present
// in a.
func GetAllUniqueValues64Map(a []int64) map[int64]bool {
	uniqueValues := make(map[int64]bool)
	for _, v := range a {
		uniqueValues[v] = true
	}
	return uniqueValues
}

// ContainsSameItems reports whether two int slices contain the same set of
// values, ignoring multiplicity.
func ContainsSameItems(a1, a2 []int) bool {
	map1 := GetAllUniqueValuesMap(a1)
	map2 := GetAllUniqueValuesMap(a2)
	//fmt.Println(map1, map2)
	return reflect.DeepEqual(map1, map2)
}

// ContainsSameDigits reports whether two ints share the same set of digits,
// ignoring digit counts.
func ContainsSameDigits(n1, n2 int) bool {
	digits1 := GetDigitsOfInt(n1)
	digits2 := GetDigitsOfInt(n2)
	map1 := GetAllUniqueValuesMap(digits1)
	map2 := GetAllUniqueValuesMap(digits2)
	return reflect.DeepEqual(map1, map2)
}

// GetDigitsOfBigInt returns the decimal digits of a big.Int as a slice of
// ints.
func GetDigitsOfBigInt(i *big.Int) []int {
	s := i.String()
	digits := make([]int, len(s))
	for k, c := range s {
		digits[k] = StrToInt(string(c))
	}
	return digits
}

// ContainsSameDigitsBig reports whether two big.Ints share the same set of
// decimal digits, ignoring digit counts.
func ContainsSameDigitsBig(n1, n2 *big.Int) bool {
	digits1 := GetDigitsOfBigInt(n1)
	digits2 := GetDigitsOfBigInt(n2)
	map1 := GetAllUniqueValuesMap(digits1)
	map2 := GetAllUniqueValuesMap(digits2)
	return reflect.DeepEqual(map1, map2)
}

// GetListFromMultiLineDelimited flattens a set of delimiter-separated lines
// into a single slice of ints.
func GetListFromMultiLineDelimited(lines []string, delimiter string) []int {
	a := []int{}
	for _, line := range lines {
		line = strings.Trim(line, "\n")
		a = append(a, GetStrArrAsIntArr(strings.Split(line, delimiter))...)
	}
	return a
}

// GetSumAsciiValues returns the sum of the rune values in s.
func GetSumAsciiValues(s string) int {
	sum := 0
	for _, c := range s {
		sum += int(c)
	}
	return sum
}

// GetMinValue returns the smallest value in the slice, or 0 if empty.
func GetMinValue(values []int) int {
	if len(values) == 0 {
		return 0
	}
	min := math.MaxInt
	for _, v := range values {
		if v < min {
			min = v
		}
	}
	return min
}

// GetMinSum returns the smallest sum across the provided integer slices.
func GetMinSum(a [][]int) int {
	minComboSum := 0
	for _, e := range a {
		comboSum := SumList(e)
		if minComboSum == 0 || comboSum < minComboSum {
			minComboSum = comboSum
		}
	}
	return minComboSum
}

// HasRepeatingPattern reports whether the string can be constructed by
// repeating one of its substrings.
func HasRepeatingPattern(s string) bool {
	for subStrLen := 1; subStrLen <= len(s)/2; subStrLen++ {
		numRepeats := len(s) / subStrLen
		//if the id length can be fully repeating with this id
		if subStrLen*numRepeats == len(s) {
			p := s[:subStrLen]
			allRepeatsFound := true
			for j := 0; j < numRepeats; j++ {
				compare := s[j*subStrLen : (j+1)*subStrLen]
				if compare != p {
					allRepeatsFound = false
					break
				}
			}
			if allRepeatsFound {
				return true
			}
		}
	}
	return false
}

// DeepCopy creates a deep copy of a 2D integer slice.
// Returns a new slice with the same values but independent memory allocation.
func DeepCopy(a [][]int) [][]int {
	b := make([][]int, len(a))
	for i := range a {
		b[i] = make([]int, len(a[i]))
		copy(b[i], a[i])
	}
	return b
}
