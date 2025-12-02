package eulerlib

func IsDiophantine(x, d, y int) bool {
	return x*x-d*y*y == 1
}

func Diophantine(d, maxX, maxY int) (int, int, bool) {
	// skip perfect squares
	if IsSquare(d) {
		return 0, 0, false
	}
	// Implementation of the Diophantine equation solver
	x := 0
	for x <= maxX {
		//simple optimisation that Y must be less than X for the equation to hold
		for y := 1; y < x && y < maxY; y++ {
			if IsDiophantine(x, d, y) {
				return x, y, true
			}
		}
		x++
	}
	return 0, 0, false
}
