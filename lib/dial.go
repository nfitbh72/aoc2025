package eulerlib

type Dial struct {
	numClicks      int
	currentPos     int
	numZeros       int
	numPassingZero int
}

func NewDial(numClicks int, startPos int) *Dial {
	return &Dial{
		numClicks:  numClicks,
		currentPos: startPos,
	}
}

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

func (d *Dial) Left(numClicks int) {
	d.move(-numClicks)
}

func (d *Dial) Right(numClicks int) {
	d.move(numClicks)
}

func (d *Dial) GetPos() int {
	return d.currentPos
}

func (d *Dial) GetNumZeros() int {
	return d.numZeros
}

func (d *Dial) GetNumPassingZero() int {
	return d.numPassingZero
}
