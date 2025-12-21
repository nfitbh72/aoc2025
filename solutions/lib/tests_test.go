package eulerlib

import (
	"math/big"
	"testing"
)

// Exercise the big.Int pointer branch in CheckTest.
func TestCheckTestBigInt(t *testing.T) {
	expect := big.NewInt(1234)
	output := big.NewInt(1234)
	test := TTest{
		Name:   "big.Int equality",
		Input:  nil,
		Expect: expect,
	}
	CheckTest(t, "tests.CheckTestBigInt", test, output)
}

// Exercise the unordered int-slice comparison branch in CheckTest.
func TestCheckTestUnorderedIntSlice(t *testing.T) {
	test := TTest{
		Name:      "unordered int slice equality",
		Input:     nil,
		Expect:    []int{1, 2, 3},
		Unordered: true,
	}
	output := []int{3, 2, 1}
	CheckTest(t, "tests.CheckTestUnorderedIntSlice", test, output)
}

// Intentionally fail a CheckTest comparison to drive the ReportError path.
func TestCheckTestReportsErrorOnMismatch(t *testing.T) {
	test := TTest{
		Name:   "mismatched ints",
		Input:  nil,
		Expect: 1,
	}
	// Use a fake testing.T so we can assert that CheckTest reports an error
	// without causing this test to fail directly.
	var fake testing.T
	CheckTest(&fake, "tests.CheckTestReportsErrorOnMismatch", test, 2)
	if !fake.Failed() {
		t.Errorf("expected CheckTest to report failure for mismatched ints")
	}
}
