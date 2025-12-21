package eulerlib

import (
	"math/big"
)

// IsLychrel applies the reverse-and-add process up to 50 iterations and
// reports whether the given number appears to be a Lychrel number (i.e. never
// produces a palindrome within that limit).
func IsLychrel(v *big.Int) bool {
	runningTotal := v
	for range 50 {
		runningTotal = runningTotal.Add(runningTotal, ReverseBig(runningTotal))
		//fmt.Println("runningTotal", runningTotal.String())
		if IsPalindromeBig(runningTotal) {
			return false
		}
	}
	return true
}
