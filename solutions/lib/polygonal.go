package eulerlib

import (
	"math"
)

// Polygonaler is implemented by types that generate polygonal number
// sequences (triangle, pentagonal, hexagonal, etc.).
type Polygonaler interface {
	GetNext() int64
	IsPolygonal(int64) bool
	GetSequence(quantity int) []int64
	StartFrom(int)
	Reset()
}

// Polygonal provides shared iteration state and helper methods for concrete
// polygonal number sequence types.
type Polygonal struct {
	Polygonaler
	iteration int
}

// StartFrom sets the internal iteration counter to the provided value.
func (m *Polygonal) StartFrom(iteration int) {
	m.iteration = iteration
}

// Reset sets the iteration counter back to zero.
func (m *Polygonal) Reset() {
	m.StartFrom(0)
}

// GetSequence returns the next quantity polygonal numbers from the sequence.
func (m *Polygonal) GetSequence(quantity int) []int64 {
	if quantity < 1 {
		return []int64{}
	}
	sequence := make([]int64, quantity)
	for i := range quantity {
		sequence[i] = m.GetNext()
	}
	return sequence
}

// GetSequenceMap returns a set-like map of the first numOfNumbers polygonal
// values in the sequence.
func (m *Polygonal) GetSequenceMap(numOfNumbers int) (sequence map[int64]bool) {
	return GetAllUniqueValues64Map(m.GetSequence(numOfNumbers))
}

// Triangle generates the sequence of triangular numbers.
//
// Triangle implements the Polygonaler interface.
type Triangle struct {
	Polygonal
}

// NewTriangle constructs a new Triangle sequence generator.
func NewTriangle() *Triangle {
	t := &Triangle{Polygonal: Polygonal{iteration: 0}}
	//why is this necessary?
	t.Polygonal.Polygonaler = t
	return t
}

// IsPolygonal reports whether number is a triangular number.
func (m *Triangle) IsPolygonal(number int64) bool {
	n := (math.Sqrt(8.0*float64(number)+1.0) - 1.0) / 2.0
	return n == math.Floor(n)
}

// GetNext returns the next triangular number in the sequence.
func (m *Triangle) GetNext() int64 {
	m.iteration++
	return int64((m.iteration * (m.iteration + 1)) / 2)
}

// Pentagonal generates the sequence of pentagonal numbers.
//
// Pentagonal implements the Polygonaler interface.
type Pentagonal struct {
	Polygonal
}

// NewPentagonal constructs a new Pentagonal sequence generator.
func NewPentagonal() *Pentagonal {
	p := &Pentagonal{Polygonal: Polygonal{iteration: 0}}
	//why is this necessary?
	p.Polygonal.Polygonaler = p
	return p
}

// GetNext returns the next pentagonal number in the sequence.
func (m *Pentagonal) GetNext() int64 {
	m.iteration++
	return int64(float64(m.iteration) * (3.0*float64(m.iteration) - 1.0) / 2.0)
}

// IsPolygonal reports whether number is a pentagonal number.
func (m *Pentagonal) IsPolygonal(number int64) bool {
	n := (math.Sqrt(24.0*float64(number)+1.0) + 1.0) / 6.0
	return n == math.Floor(n)
}

// Hexagonal generates the sequence of hexagonal numbers.
//
// Hexagonal implements the Polygonaler interface.
type Hexagonal struct {
	Polygonal
}

// NewHexagonal constructs a new Hexagonal sequence generator.
func NewHexagonal() *Hexagonal {
	h := &Hexagonal{Polygonal: Polygonal{iteration: 0}}
	//why is this necessary?
	h.Polygonal.Polygonaler = h
	return h
}

// GetNext returns the next hexagonal number in the sequence.
func (m *Hexagonal) GetNext() int64 {
	m.iteration++
	return int64(float64(m.iteration) * (2.0*float64(m.iteration) - 1.0))
}

// IsPolygonal reports whether number is a hexagonal number.
func (m *Hexagonal) IsPolygonal(number int64) bool {
	n := (math.Sqrt(8.0*float64(number)+1.0) + 1.0) / 4.0
	return n == math.Floor(n)
}
