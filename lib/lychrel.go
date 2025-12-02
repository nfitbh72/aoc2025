package eulerlib

import (
	"math/big"
)

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
