package main

import (
	"testing"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

func TestProblem(t *testing.T) {
	eulerlib.SetDebugger(true)
	p := &Problem{}
	eulerlib.TestProblem(p, t)
}
