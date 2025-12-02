package eulerlib

import (
	"math/big"
	"testing"
)

func TestIsLychrel(t *testing.T) {
	tests := []TTest{
		{
			Name:   "47",
			Input:  47,
			Expect: false,
		},
		{
			Name:   "349",
			Input:  349,
			Expect: false,
		},
		{
			Name:   "196",
			Input:  196,
			Expect: true,
		},
	}
	for _, test := range tests {
		t.Run(test.Name, func(t *testing.T) {
			CheckTest(t, "lycrel.IsLychrel", test, IsLychrel(big.NewInt(int64(test.Input.(int)))))
		})
	}
}
