package eulerlib

import (
	"testing"
)

func TestDial(t *testing.T) {
	d := NewDial(100, 50)
	d.Left(68)
	d.Left(30)
	d.Right(48)

	CheckTest(t, "lib.Dial", TTest{
		Name:   "Left, Left, Right, result",
		Input:  "",
		Expect: 0,
	}, d.GetPos())

}

func TestDialNumZeros(t *testing.T) {
	d := NewDial(100, 50)
	d.Left(68)
	d.Left(30)
	d.Right(48)

	CheckTest(t, "lib.Dial", TTest{
		Name:   "Left, Left, Right, result",
		Input:  "",
		Expect: 1,
	}, d.GetNumZeros())
}

func TestDialNumPassingZero(t *testing.T) {
	d := NewDial(100, 50)
	d.Left(68)
	d.Left(30)
	d.Right(48)

	CheckTest(t, "lib.Dial", TTest{
		Name:   "Left, Left, Right, result",
		Input:  "",
		Expect: 2,
	}, d.GetNumPassingZero())
}

func TestDialNumPassingZero2(t *testing.T) {
	d := NewDial(100, 50)
	d.Left(68)
	d.Left(30)
	d.Right(48)
	d.Right(48)

	CheckTest(t, "lib.Dial", TTest{
		Name:   "Left, Left, Right, result",
		Input:  "",
		Expect: 2,
	}, d.GetNumPassingZero())
}

func TestDialNumPassingZero3(t *testing.T) {
	d := NewDial(100, 50)
	d.Left(168)
	d.Left(130)
	d.Right(148)
	d.Right(148)

	CheckTest(t, "lib.Dial", TTest{
		Name:   "Left, Left, Right, result",
		Input:  "",
		Expect: 6,
	}, d.GetNumPassingZero())
}
