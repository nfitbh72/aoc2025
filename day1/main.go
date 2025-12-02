package main

import (
	"fmt"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

func main() {
	lines := eulerlib.GetFileInputTxt()
	fmt.Println(eulerlib.GetMatchesAll("56**3", "*", false, eulerlib.IsPrime))
}
