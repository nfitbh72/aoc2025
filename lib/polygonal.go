package eulerlib

import (
	"math"
)

type Polygonaler interface {
	GetNext() int64
	IsPolygonal(int64) bool
	GetSequence(quantity int) []int64
	StartFrom(int)
	Reset()
}

type Polygonal struct {
	Polygonaler
	iteration int
}

func (m *Polygonal) StartFrom(iteration int) {
	m.iteration = iteration
}

func (m *Polygonal) Reset() {
	m.StartFrom(0)
}

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

func (m *Polygonal) GetSequenceMap(numOfNumbers int) (sequence map[int64]bool) {
	return GetAllUniqueValues64Map(m.GetSequence(numOfNumbers))
}

type Triangle struct {
	Polygonal
}

func NewTriangle() *Triangle {
	t := &Triangle{Polygonal: Polygonal{iteration: 0}}
	//why is this necessary?
	t.Polygonal.Polygonaler = t
	return t
}

func (m *Triangle) IsPolygonal(number int64) bool {
	n := (math.Sqrt(8.0*float64(number)+1.0) - 1.0) / 2.0
	return n == math.Floor(n)
}

func (m *Triangle) GetNext() int64 {
	m.iteration++
	return int64((m.iteration * (m.iteration + 1)) / 2)
}

type Pentagonal struct {
	Polygonal
}

func NewPentagonal() *Pentagonal {
	p := &Pentagonal{Polygonal: Polygonal{iteration: 0}}
	//why is this necessary?
	p.Polygonal.Polygonaler = p
	return p
}

func (m *Pentagonal) GetNext() int64 {
	m.iteration++
	return int64(float64(m.iteration) * (3.0*float64(m.iteration) - 1.0) / 2.0)
}

func (m *Pentagonal) IsPolygonal(number int64) bool {
	n := (math.Sqrt(24.0*float64(number)+1.0) + 1.0) / 6.0
	return n == math.Floor(n)
}

type Hexagonal struct {
	Polygonal
}

func NewHexagonal() *Hexagonal {
	h := &Hexagonal{Polygonal: Polygonal{iteration: 0}}
	//why is this necessary?
	h.Polygonal.Polygonaler = h
	return h
}

func (m *Hexagonal) GetNext() int64 {
	m.iteration++
	return int64(float64(m.iteration) * (2.0*float64(m.iteration) - 1.0))
}

func (m *Hexagonal) IsPolygonal(number int64) bool {
	n := (math.Sqrt(8.0*float64(number)+1.0) + 1.0) / 4.0
	return n == math.Floor(n)
}
