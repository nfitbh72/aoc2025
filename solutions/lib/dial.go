package eulerlib

// Dial models a circular dial with a fixed number of positions, tracking the
// current position as well as how many times zero has been visited or passed.
//
// A Dial is initialized with a fixed number of positions and a starting position.
// It can be rotated left or right by a specified number of positions, and it
// tracks the number of times it stops exactly on zero and the number of times it
// passes over zero while rotating.
type Dial struct {
	numClicks      int
	currentPos     int
	numZeros       int
	numPassingZero int
}

// NewDial constructs a new Dial with the given number of positions and
// starting position.
func NewDial(numClicks int, startPos int) *Dial {
	return &Dial{
		numClicks:  numClicks,
		currentPos: startPos,
	}
}

// getNumPassingZeros calculates the number of times the dial passes over zero
// when rotating by the specified number of positions from the old position.
func (d *Dial) getNumPassingZeros(numClicks int, oldPos int) int {
	//calculate number of passing zeros
	numPassingZero := IntAbs(numClicks) / d.numClicks
	//if going left and the new position is greater than the old position, it means it passed an extra zero
	if numClicks < 0 && d.currentPos > oldPos {
		numPassingZero++
	}
	//if going right and the new position is less than the old position, it means it passed an extra zero
	if numClicks > 0 && d.currentPos < oldPos {
		numPassingZero++
	}
	return numPassingZero
}

// move rotates the dial by the specified number of clicks, updating the
// current position and tracking zero visits and crossings.
func (d *Dial) move(numClicks int) {
	if numClicks == 0 {
		return
	}
	oldPos := d.currentPos
	d.currentPos = (d.currentPos + numClicks) % d.numClicks
	if d.currentPos < 0 {
		d.currentPos += d.numClicks
	}

	//record the number of zeros
	if d.currentPos == 0 {
		d.numZeros++
	}

	d.numPassingZero += d.getNumPassingZeros(numClicks, oldPos)
}

// Left rotates the dial left (negative direction) by numClicks positions.
func (d *Dial) Left(numClicks int) {
	d.move(-numClicks)
}

// Right rotates the dial right (positive direction) by numClicks positions.
func (d *Dial) Right(numClicks int) {
	d.move(numClicks)
}

// GetPos returns the current position of the dial.
func (d *Dial) GetPos() int {
	return d.currentPos
}

// GetNumZeros returns how many times the dial has stopped exactly on zero.
func (d *Dial) GetNumZeros() int {
	return d.numZeros
}

// GetNumPassingZero returns how many times the dial has passed over zero
// while rotating.
func (d *Dial) GetNumPassingZero() int {
	return d.numPassingZero
}
