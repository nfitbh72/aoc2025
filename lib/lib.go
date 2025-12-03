package eulerlib

import (
	"fmt"
	"io"
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

func GetFileInputTxt(filename string) []string {
	out := []string{}
	file, err := os.Open(filename)
	if err != nil {
		log.Println(err)
		return out
	}
	defer func() {
		if err = file.Close(); err != nil {
			log.Println(err)
		}
	}()

	b, err := io.ReadAll(file)
	if err != nil {
		log.Println(err)
		return out
	}
	s := string(b)
	return strings.Split(s, "\n")
}

func IntAbs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func Int64Abs(x int64) int64 {
	if x < 0 {
		return -x
	}
	return x
}

func StrToInt(v string) int {
	i, _ := strconv.Atoi(v)
	return i
}

func IntToStr(i int) string {
	return fmt.Sprintf("%d", i)
}

func Int64ToStr(i int64) string {
	return fmt.Sprintf("%d", i)
}

func BigIntToStr(i *big.Int) string {
	return fmt.Sprintf("%d", i)
}

func AnyToInt(a any) int {
	return a.(int)
}

func RuneToInt(v rune) int {
	return int(v - '0')
}

func ReverseString(s string) (result string) {
	for _, v := range s {
		result = string(v) + result
	}
	return
}

func ReverseBig(b *big.Int) *big.Int {
	s := ReverseString(b.String())
	big := big.NewInt(0)
	bigStr, _ := big.SetString(s, 10)
	return bigStr
}

func Shuffle(src []int) []int {
	dest := make([]int, len(src))
	perm := rand.Perm(len(src))
	for i, v := range perm {
		dest[v] = src[i]
	}
	return dest
}

func GetMiddleItem(a []int) int {
	//fmt.Println(len(a), len(a)/2)
	return a[len(a)/2]
}

func SliceSwap(a []int, p1, p2 int) {
	v := a[p1]
	a[p1] = a[p2]
	a[p2] = v
}

func SliceMultiply(a []int) int {
	r := 1
	for _, i := range a {
		r = r * i
	}
	return r
}

func IsDivisible(v, d int) bool {
	return (d*(v/d) == v)
}

func GetAllDivisibles(v int) []int {
	a := make([]int, 0)
	for i := 1; i <= v/2; i++ {
		if IsDivisible(v, i) {
			a = append(a, i)
		}
	}
	return a
}

func ToStringFromRunes(runes []any) string {
	str := ""
	for _, r := range runes {
		str += string(r.(rune))
	}
	return str
}

func PowInt(x, y int) int {
	return int(math.Pow(float64(x), float64(y)))
}

func ConcatInts(x, y int) int {
	i := 1
	for i < y {
		i *= 10
	}
	return x*i + y

	//return StrToInt(fmt.Sprintf("%d%d", x, y))
}

func IsEven(i int) bool {
	return (2*(i/2) == i)
}

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

func GetStrArrAsIntArr(strs []string) []int {
	i := make([]int, 0)
	for _, s := range strs {
		i = append(i, StrToInt(s))
	}
	return i
}

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

func GetArrAsInt(a []int) int {
	i := 0
	for _, d := range a {
		i = i*10 + d
	}
	return i
}

func GetLinesAsIntArr(str []string) [][]int {
	i := make([][]int, 0)
	for _, s := range str {
		a := strings.Split(s, " ")
		i = append(i, GetStrArrAsIntArr(a))
	}
	return i
}

func GetIntArrFromDelimitedStr(s string, d string, quoted bool) []int {
	if quoted {
		s = s[1 : len(s)-1]
		//fmt.Println(s)
		return GetStrArrAsIntArr(strings.Split(s, "\""+d+"\""))
	}
	return GetStrArrAsIntArr(strings.Split(s, d))
}

func GetArrFromDelimitedStr(s string, d string, quoted bool) []string {
	if quoted {
		s = s[1 : len(s)-1]
		//fmt.Println(s)
		return strings.Split(s, "\""+d+"\"")
	}
	return strings.Split(s, d)
}

func GetArrFromCommaDelimited(s string, quoted bool) []string {
	return GetArrFromDelimitedStr(s, ",", quoted)
}

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

func GetStrArrAsString(a []string) string {
	s := ""
	for _, v := range a {
		s += v
	}
	return s
}

func GetArrAsString(a []int) string {
	s := ""
	for _, v := range a {
		s += IntToStr(v)
	}
	return s
}

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

func GetDigitCount(i int) map[int]int {
	digits := GetDigitsOfInt(i)
	digitCount := make(map[int]int)
	for _, d := range digits {
		digitCount[d]++
	}
	return digitCount
}

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

func DigitsToInt(a []int) int {
	i := 0
	for _, d := range a {
		i = i*10 + d
	}
	return i
}

func RemoveItemFromList(l []int, index int) []int {
	if len(l) == 0 {
		return l
	}
	return append(l[:index], l[index+1:]...)
}

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

func IsSameUnorderedSlice(a1, a2 []int) bool {
	slices.Sort(a1)
	slices.Sort(a2)
	return reflect.DeepEqual(a1, a2)
}
func IsSameUnorderedStringSlice(a1, a2 []string) bool {
	slices.Sort(a1)
	slices.Sort(a2)
	return reflect.DeepEqual(a1, a2)
}

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

func GetMaxValue(values []int) int {
	max := 0
	for _, v := range values {
		if v > max {
			max = v
		}
	}
	return max
}

func ContainsSameDigitsAndNumberOfEachDigit(n1, n2 int) bool {
	digits1 := GetDigitsOfInt(n1)
	digits2 := GetDigitsOfInt(n2)
	slices.Sort(digits1)
	slices.Sort(digits2)
	return reflect.DeepEqual(digits1, digits2)
}

func GetAllUniqueValuesMap(a []int) map[int]bool {
	uniqueValues := make(map[int]bool)
	for _, v := range a {
		uniqueValues[v] = true
	}
	return uniqueValues
}

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

func GetAllUniqueValues64Map(a []int64) map[int64]bool {
	uniqueValues := make(map[int64]bool)
	for _, v := range a {
		uniqueValues[v] = true
	}
	return uniqueValues
}

func ContainsSameItems(a1, a2 []int) bool {
	map1 := GetAllUniqueValuesMap(a1)
	map2 := GetAllUniqueValuesMap(a2)
	//fmt.Println(map1, map2)
	return reflect.DeepEqual(map1, map2)
}

func ContainsSameDigits(n1, n2 int) bool {
	digits1 := GetDigitsOfInt(n1)
	digits2 := GetDigitsOfInt(n2)
	map1 := GetAllUniqueValuesMap(digits1)
	map2 := GetAllUniqueValuesMap(digits2)
	return reflect.DeepEqual(map1, map2)
}

func GetDigitsOfBigInt(i *big.Int) []int {
	s := i.String()
	digits := make([]int, len(s))
	for k, c := range s {
		digits[k] = StrToInt(string(c))
	}
	return digits
}

func ContainsSameDigitsBig(n1, n2 *big.Int) bool {
	digits1 := GetDigitsOfBigInt(n1)
	digits2 := GetDigitsOfBigInt(n2)
	map1 := GetAllUniqueValuesMap(digits1)
	map2 := GetAllUniqueValuesMap(digits2)
	return reflect.DeepEqual(map1, map2)
}

func GetListFromMultiLineDelimited(lines []string, delimiter string) []int {
	a := []int{}
	for _, line := range lines {
		line = strings.Trim(line, "\n")
		a = append(a, GetStrArrAsIntArr(strings.Split(line, delimiter))...)
	}
	return a
}

func GetSumAsciiValues(s string) int {
	sum := 0
	for _, c := range s {
		sum += int(c)
	}
	return sum
}

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
