package eulerlib

type Dial struct {
	numClicks  int
	currentPos int
	numZeros   int
}

func NewDial(numClicks int, startPos int) *Dial {
	return &Dial{
		numClicks:  numClicks,
		currentPos: startPos,
	}
}

func (d *Dial) Left(numClicks int) {
	d.currentPos = (d.currentPos - numClicks + d.numClicks) % d.numClicks
	if d.currentPos == 0 {
		d.numZeros++
	}
}

func (d *Dial) Right(numClicks int) {
	d.currentPos = (d.currentPos + numClicks) % d.numClicks
	if d.currentPos == 0 {
		d.numZeros++
	}
}

func (d *Dial) GetPos() int {
	return d.currentPos
}

func (d *Dial) GetNumZeros() int {
	return d.numZeros
}
