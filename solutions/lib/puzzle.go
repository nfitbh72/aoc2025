package eulerlib

import "fmt"

type TPiece struct {
	Structure []int //int array with each byte's bits specifying "on"
	MaxWidth  int
}

func (m *TPiece) IsOn(x, y int) bool {
	//fmt.Println(m.Structure, m.Structure[y], "%", PowByte(2, x), "=", m.Structure[y]&PowByte(2, x))
	return m.Structure[y]&PowInt(2, x) > 0
}

func (m *TPiece) Init(sizeX, sizeY int) {
	m.Structure = make([]int, sizeY)
	m.MaxWidth = sizeX
}

func (m *TPiece) ParseInit(lines []string) {
	m.Structure = make([]int, len(lines))
	for i, line := range lines {
		index := 1
		for j, c := range line {
			if c == '#' {
				m.Structure[i] = m.Structure[i] + index
				if m.MaxWidth < j+1 {
					m.MaxWidth = j + 1
				}
			}
			index *= 2
		}

	}
}

func (m *TPiece) ToString() string {
	s := ""
	for y, v := range m.Structure {
		s += fmt.Sprintf("%d: ", v)
		for x := range m.MaxWidth {
			if m.IsOn(x, y) {
				s += "#"
			} else {
				s += "."
			}
		}
		s += "\n"
	}
	return s
}

func (m *TPiece) Rotate() *TPiece {
	newPiece := TPiece{}
	newPiece.Init(len(m.Structure), m.MaxWidth)
	for x := 0; x < m.MaxWidth; x++ {
		index := 1
		for y := 0; y < len(m.Structure); y++ {
			if m.IsOn(x, y) {
				newPiece.Structure[m.MaxWidth-x-1] += index
			}
			index *= 2
		}
	}
	return &newPiece
}

func (m *TPiece) Flip() *TPiece {
	newPiece := TPiece{}
	newPiece.Init(len(m.Structure), m.MaxWidth)
	for x := 0; x < m.MaxWidth; x++ {
		index := 1
		for y := 0; y < len(m.Structure); y++ {
			if m.IsOn(x, y) {
				newPiece.Structure[x] += index
			}
			index *= 2
		}
	}
	return &newPiece
}

func (m *TPiece) Clone() *TPiece {
	newPiece := TPiece{}
	newPiece.Init(m.MaxWidth, len(m.Structure))
	copy(newPiece.Structure, m.Structure)
	return &newPiece
}

func (m *TPiece) IsEqual(other *TPiece) bool {
	if len(m.Structure) == len(other.Structure) && m.MaxWidth == other.MaxWidth {
		for i, v := range m.Structure {
			if other.Structure[i] != v {
				return false
			}
		}
		return true
	}
	return false
}

func (m *TPiece) IsIn(others []*TPiece) bool {
	for _, other := range others {
		if len(m.Structure) == len(other.Structure) && m.MaxWidth == other.MaxWidth {
			allSame := true
			for i, v := range m.Structure {
				if other.Structure[i] != v {
					allSame = false
					break
				}
			}
			if allSame {
				return true
			}
		}
	}
	return false
}

func (m *TPiece) GetPermutations() []*TPiece {
	pieces := []*TPiece{}
	newPiece := m.Clone()
	pieces = append(pieces, newPiece)
	for range 3 {
		newPiece = newPiece.Rotate()
		if !newPiece.IsIn(pieces) {
			pieces = append(pieces, newPiece)
		}
	}
	newPiece = m.Flip()
	if !newPiece.IsIn(pieces) {
		pieces = append(pieces, newPiece)
		for range 3 {
			newPiece = newPiece.Rotate()
			pieces = append(pieces, newPiece)
		}
	} else {
		//fmt.Println("found in array", newPiece.ToString())
	}
	return pieces
}

type TPuzzle struct {
	Pieces        []*TPiece
	GridWidth     int
	GridHeight    int
	CountOfPieces []int
	permutations  [][]*TPiece
	grid          []int
}

func (m *TPuzzle) Init(gridWidth, gridHeight int, pieces []*TPiece, countOfPieces []int) {
	m.Pieces = pieces
	m.GridWidth = gridWidth
	m.GridHeight = gridHeight
	m.CountOfPieces = countOfPieces
	m.permutations = make([][]*TPiece, 0)
}

func (m *TPuzzle) ToString() string {
	s := fmt.Sprintf("Grid: %dx%d\nCounts: ", m.GridWidth, m.GridHeight)
	for _, c := range m.CountOfPieces {
		s += IntToStr(c) + " "
	}
	s += "\n"
	for _, p := range m.Pieces {
		s += p.ToString() + "\n"
	}
	return s
}

func (m *TPuzzle) CanPiecesFit() bool {
	//get the permutations for each piece
	for _, p := range m.Pieces {
		perms := p.GetPermutations()
		m.permutations = append(m.permutations, perms)
	}

	//now we have to get all the pieces that we need to fit in the grid
	//e.g. if the count of pieces is 3 0 0 5 0 then we need 3 of all the first piece, 5 of the 4th piece
	allPieces := [][]*TPiece{}
	for i, c := range m.CountOfPieces {
		for range c {
			allPieces = append(allPieces, m.permutations[i])
		}
	}

	return false
}
