package eulerlib

import (
	"testing"
)

func TestDial(t *testing.T) {
	d := NewDial(50, 0)
	d.Left(68)
	d.Left(30)
	d.Right(48)

	CheckTest(t, "lib.Dial", TTest{
		Name:   "Left, Left, Right, result",
		Input:  "",
		Expect: 0,
	}, d.currentPos)
}
