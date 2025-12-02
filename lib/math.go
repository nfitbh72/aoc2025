package eulerlib

import (
	"fmt"
	"math"
	"math/big"
	"reflect"
	"slices"
	"strings"
)

func GetNumMultiplesDivisibleBy(attempts int, divisors []int) int {
	total := 0
	for i := range attempts {
		for _, divisor := range divisors {
			if IsDivisible(i, divisor) {
				total += i
				break
			}
		}
	}
	return total
}

func IsPrime(v int) bool {
	if v < 2 {
		return false
	}
	if v == 2 {
		return true
	}
	for i := 2; i <= v/2; i++ {
		if IsDivisible(v, i) {
			return false
		}
	}
	return true
}

func CountPrimes(a []int) int {
	count := 0
	for _, i := range a {
		if IsPrime(i) {
			count++
		}
	}
	return count
}

func IsPalindromeString(v string) bool {
	vSlice := strings.Split(v, "")
	vRSlice := make([]string, len(vSlice))
	copy(vRSlice, vSlice)
	slices.Reverse(vSlice)
	return reflect.DeepEqual(vSlice, vRSlice)
}

func IsPalindrome(v int) bool {
	vStr := fmt.Sprintf("%d", v)
	return IsPalindromeString(vStr)
}

func IsPalindromeBinary(v int) bool {
	vStr := fmt.Sprintf("%b", v)
	return IsPalindromeString(vStr)
}

func IsPalindromeBig(v *big.Int) bool {
	vStr := BigIntToStr(v)
	return IsPalindromeString(vStr)
}

func HighestPalindromeOfTwoFactors(maxI, maxJ int) int {
	highestPalindrome := 0
	for i := range maxI {
		for j := range maxJ {
			v := i * j
			if IsPalindrome(v) && v > highestPalindrome {
				highestPalindrome = v
			}
		}
	}
	return highestPalindrome
}

func GetSmallestEvenlyDivisibleNumber(maxJ int) int {
	i := 1
	for {
		allEvenlyDivisible := true
		for j := 1; j < maxJ; j++ {
			if i%j != 0 {
				allEvenlyDivisible = false
				break
			}
		}
		if allEvenlyDivisible {
			return i
		}
		i++
	}
}

func SumOfSquares(start, end int) int {
	total := 0
	for i := start; i <= end; i++ {
		total += i * i
	}
	return total
}

func SquareOfSums(start, end int) int {
	sum := 0
	for i := start; i <= end; i++ {
		sum += i
	}
	return sum * sum
}

func Product(s []int) (total int) {
	//total := 0
	for _, v := range s {
		if total == 0 {
			total = v
			//fmt.Println("total", total)
		} else {
			total *= v
			//fmt.Println("total*", total, v)
		}
	}
	return total
}

func Sum(a []int) (sum int) {
	for _, v := range a {
		sum += v
	}
	return sum
}

// big int or int as argument
func SumOfDigits(i any) int {
	s := fmt.Sprintf("%d", i)
	v := 0
	for _, r := range s {
		v += int(r - '0')
	}
	return v
}

func Factorial(i int) *big.Int {
	val := big.NewInt(1)
	for j := 2; j <= i; j++ {
		val = val.Mul(big.NewInt(int64(j)), val)
	}
	return val
}

func GetUniqueDivisors(num int) []int {
	a := make([]int, 0)
	for i := 1; i < 1+num/2; i++ {
		if IsDivisible(num, i) {
			a = append(a, i)
		}
	}
	//fmt.Println(a)
	return a
}

func IsAmicable(a, b int) bool {
	if a == b {
		return false
	}
	aSumD := Sum(GetUniqueDivisors(a))
	bSumD := Sum(GetUniqueDivisors(b))
	return (aSumD == b && bSumD == a)
}

func IsPerfect(a int) bool {
	return (Sum(GetUniqueDivisors(a)) == a)
}

func IsAbundant(a int) bool {
	return (Sum(GetUniqueDivisors(a)) > a)
}

func GetAllAbundantNumbersUnder(v int) (a []int) {
	a = make([]int, 0)
	for i := range v {
		if IsAbundant(i) {
			a = append(a, i)
		}
	}
	return a
}

func EqualAnyTwoSum(v int, a []int) bool {
	for _, i := range a {
		for _, j := range a {
			if i+j == v {
				return true
			}
		}
	}
	return false
}

func GetPrecision(intDigits, fractionDigits int) uint {
	return uint(math.Ceil((float64(fractionDigits) + float64(intDigits)) * math.Log2(10.0)))
}

// This function calculates the precision needed for a big.Float based on a decimal string input
// Parameters:
//
//	s: A string representation of a decimal number (e.g. "123.456")
//
// Returns:
//
//	uint: The precision in bits needed to accurately represent the number
//
// Logic:
//   - Returns 0 if string is empty or has multiple decimal points
//   - Finds position of decimal point to determine number of integer digits
//   - Calculates number of fractional digits after decimal
//   - Calls GetPrecision() to convert decimal digits to required binary precision
func GetPrecisionFromStr(s string) uint {
	if s == "" || strings.Count(s, ".") > 1 {
		return 0
	}
	//check if s is a number
	_, err := fmt.Sscanf(s, "%f", new(float64))
	if err != nil {
		return 0
	}
	integerDigitSize := strings.Index(s, ".")
	fractionalDigitSize := len(s) - (integerDigitSize + 1) // exclude the decimal from the count
	return GetPrecision(integerDigitSize, fractionalDigitSize)
}

// This function converts a string representation of a decimal number to a big.Float
// Parameters:
//
//	s: A string representation of a decimal number (e.g. "123.456")
//
// Returns:
//
//	*big.Float: A big.Float representation of the input string
//
// Logic:
//   - Returns 0.0 if string is empty
//   - Gets required precision from GetPrecisionFromStr()
//   - Creates new big.Float and sets precision
//   - Parses string into big.Float using SetString()
func GetBigFloatFromStr(s string) *big.Float {
	if s == "" {
		return big.NewFloat(0.0)
	}
	//if its not a number return 0
	prec := GetPrecisionFromStr(s)
	if prec == 0 {
		return big.NewFloat(0.0)
	}
	bf := big.NewFloat(0.0)
	bf, _ = bf.SetPrec(prec).SetString(s)
	return bf
}

func GetStrFromBigFloat(bf *big.Float) string {
	if bf != nil {
		return bf.Text('f', -1)
	}
	return "0"
}

func BigFloatDivideFloats(f1, f2 float64, prec uint) *big.Float {
	i, j := new(big.Float), new(big.Float)
	i.SetPrec(prec)
	j.SetPrec(prec)
	i.SetFloat64(f1)
	j.SetFloat64(f2)
	return new(big.Float).Quo(i, j)
}

func BigFloatMultiply(f1, f2 float64) *big.Float {
	i, j := big.NewFloat(f1), big.NewFloat(f2)
	return new(big.Float).Mul(i, j)
}

func BigIntMultiply(i1, i2 int64) *big.Int {
	i, j := big.NewInt(i1), big.NewInt(i2)
	return new(big.Int).Mul(i, j)
}

func GetNumSequentialPrimesForRemarkablePrimeQuadratic(a, b int) int {
	n := 0
	for {
		//remarkable quadratic
		v := n*n + a*n + b
		//also not prime
		if !IsPrime(v) {
			return n
		}
		n++
	}
}

func BigPowInt(a, b *big.Int) *big.Int {
	return a.Exp(a, b, nil)
}

func SumList(a []int) int {
	sum := 0
	for _, v := range a {
		sum += v
	}
	return sum
}

func SumKeys(ma map[int]bool) int {
	total := 0
	for k := range ma {
		total += k
	}
	return total
}

func IsSumPrimeAndTwiceSquare(num int) bool {
	for i := 1; i < num; i++ {
		if IsPrime(i) {
			for j := 1; j < num; j++ {
				v := i + 2*j*j
				//fmt.Println("checking", num, i, j, v)
				if v == num {
					return true
				}
			}
		}
	}
	return false
}

func GetUniquePrimeFactors(in int) []int {
	if in < 2 {
		return []int{}
	}
	primeFactors := []int{}

	factors := GetUniqueDivisors(in)
	for _, f := range factors {
		if IsPrime(f) {
			primeFactors = append(primeFactors, f)
		}
	}
	return primeFactors
}

func GetPrimesOfList(a []int) []int {
	primes := []int{}
	for _, v := range a {
		if IsPrime(v) {
			primes = append(primes, v)
		}
	}
	return primes
}

// finds sequences of three prime numbers that have interesting properties
// finds groups of three prime numbers that:
// - Are permutations of each other (contain the same digits in different orders)
// - Have equal differences between them (like an arithmetic sequence)
// - Fall within a given range (between 'start' and 'end')
type PrimeSequence struct {
	currentNumber int
	sequence      []int
}

func (m *PrimeSequence) Next() int {
	if m.currentNumber == 0 {
		m.currentNumber = 1
		m.sequence = []int{}
	}
	for i := m.currentNumber + 1; !IsPrime(i); i++ {
		m.currentNumber++
	}
	m.currentNumber++
	m.sequence = append(m.sequence, m.currentNumber+1)
	return m.currentNumber
}

func (m *PrimeSequence) NextWithCondition(condition func(int) bool) int {
	for {
		j := m.Next()
		if condition(j) {
			return j
		}
	}
}

func GetPrimePermutationsEqualInDifference(start, end int) [][]int {
	return FindArithmeticPrimeSequences(start, end, 3)
}

func FindArithmeticPrimeSequences(start, end, sequenceLength int) [][]int {
	var sequences [][]int

	for i := start; i <= end; i++ {
		if !IsPrime(i) {
			continue
		}

		primePerms := FindPrimePermutations(i, start, end)
		if len(primePerms) < sequenceLength {
			continue
		}

		newSequences := FindArithmeticSequences(primePerms, sequenceLength)
		sequences = append(sequences, newSequences...)
	}

	return GetDistinct(sequences)
}

func FindPrimePermutations(num, start, end int) []int {
	perms := TPerms{}
	perms.Init(GetDigitsOfInt(num))

	// Convert permutations to integers
	var permInts []int
	for _, p := range perms.GetPerms() {
		permInt := DigitsToInt(p)
		if permInt >= start && permInt <= end {
			permInts = append(permInts, permInt)
		}
	}

	return GetPrimesOfList(permInts)
}

func FindArithmeticSequences(numbers []int, sequenceLength int) [][]int {
	var sequences [][]int
	perms := TPerms{}

	combinations := perms.GetCombinations(numbers, sequenceLength)
	for _, combo := range combinations {
		if IsArithmeticSequence(combo) {
			sortedCombo := make([]int, len(combo))
			copy(sortedCombo, combo)
			slices.Sort(sortedCombo)
			sequences = append(sequences, sortedCombo)
		}
	}

	return sequences
}

func IsArithmeticSequence(numbers []int) bool {
	if len(numbers) < 2 {
		return true
	}

	sorted := make([]int, len(numbers))
	copy(sorted, numbers)
	slices.Sort(sorted)

	diff := sorted[1] - sorted[0]
	if diff == 0 {
		return false
	}

	for i := 2; i < len(sorted); i++ {
		if sorted[i]-sorted[i-1] != diff {
			return false
		}
	}

	return true
}

func GetPrimesList(start, end int) []int {
	primes := []int{}
	for i := start; i <= end; i++ {
		if IsPrime(i) {
			primes = append(primes, i)
		}
	}
	return primes
}

func GetConsecutivePrimeNumbers(numPrimes, minNumConsecutive int) [][]int {
	result := [][]int{}
	//fmt.Printf("generating %d primes\n", numPrimes)
	primes := GetPrimesList(2, numPrimes)
	//fmt.Println("summing the potential permutations")
	if len(primes) >= minNumConsecutive {
		for startI := len(primes) - 1; startI >= 0; startI-- {
			for endI := len(primes) - 1; endI > startI; endI-- {
				if endI-startI >= minNumConsecutive {
					sumList := SumList(primes[startI:endI])
					if IsPrime(sumList) {
						result = append(result, primes[startI:endI])
						//fmt.Println(startI, endI, sumList)
					}
				}
			}
		}
	}
	return result
}

func GetConsecutiveNumbersWithHighestProduct(a []int, adjacentNumbers int) []int {
	highestProduct := 0
	highestProductNumbers := make([]int, adjacentNumbers)
	for i := adjacentNumbers - 1; i < len(a); i++ {
		start := i - adjacentNumbers + 1
		end := i
		numbers := make([]int, adjacentNumbers)
		for j := start; j <= end; j++ {
			numbers[j-start] = a[j]
		}
		product := Product(numbers)
		if product > highestProduct {
			highestProduct = product
			copy(highestProductNumbers, numbers)
		}
	}
	return highestProductNumbers
}

func GetNthPrimeNumber(n int) int {
	prime := 0
	primeCount := 0
	i := 0
	for {
		if IsPrime(i) {
			primeCount++
			prime = i
		}
		if primeCount == n {
			break
		}
		i++
	}
	return prime
}

func GetSumOfPrimesBelow(maxPrime int) int {
	total := 0
	for i := 2; i < maxPrime; i++ {
		//fmt.Println(i)
		if IsPrime(i) {
			total += i
		}
	}
	return total
}

func GetSquareRootCovergents(iterations int) (*big.Int, *big.Int) {
	if iterations == 1 {
		return big.NewInt(int64(3)), big.NewInt(int64(2))
	} else {
		numerator, denominator := GetSquareRootCovergents(iterations - 1)
		numCopy := new(big.Int).Set(numerator)
		demCopy := new(big.Int).Set(denominator)
		numerator = numerator.Add(numerator, denominator.Mul(denominator, big.NewInt(2)))
		denominator = numCopy.Add(numCopy, demCopy)
		return numerator, denominator
		//return numerator + 2*denominator, numerator + denominator
	}
}

func IsSquare(n int) bool {
	if n < 0 {
		return false // Negative numbers cannot be perfect squares
	}
	if n == 0 {
		return true // 0 is a perfect square (0*0 = 0)
	}

	// Calculate the square root
	sqrt := math.Sqrt(float64(n))

	// Check if the square root is an integer
	// This is done by comparing the floor of the square root to the square root itself.
	return sqrt == math.Floor(sqrt)
}
