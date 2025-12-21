package eulerlib

// IsDiophantine reports whether the given x and y satisfy the Pell-type
// Diophantine equation x^2 - d*y^2 = 1.
func IsDiophantine(x, d, y int) bool {
	return x*x-d*y*y == 1
}

// Diophantine searches for integer solutions (x, y) to x^2 - d*y^2 = 1 for a
// given d, within the bounds 0 < x <= maxX and 0 < y < min(x, maxY).
// It skips perfect-square values of d and returns (x, y, true) on success or
// (0, 0, false) if no solution is found within the bounds.
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
