package eulerlib

type Diagonals struct {
	BottomRight []int
	TopRight    []int
	TopLeft     []int
	BottomLeft  []int
	Iteration   int
}

func (m *Diagonals) Init() {
	m.BottomLeft = []int{}
	m.BottomRight = []int{}
	m.TopLeft = []int{}
	m.TopRight = []int{}
	m.Iteration = 0
}

func (m *Diagonals) Next() {
	m.Iteration++
	// BottomRight
	i := m.Iteration*2 + 1
	m.BottomRight = append(m.BottomRight, i*i)
	// TopLeft
	m.TopLeft = append(m.TopLeft, i*i-(4*m.Iteration))
	// TopRight
	m.TopRight = append(m.TopRight, i*i-(6*m.Iteration))
	// BottomLeft
	m.BottomLeft = append(m.BottomLeft, i*i-(2*m.Iteration))
}
