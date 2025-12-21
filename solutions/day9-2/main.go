package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 8, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "4725826296"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "24"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

type TPoint struct {
	X int
	Y int
}

func (m *Problem) IsRectangleEnclosed(grid *eulerlib.CompactGrid, p1, p2 TPoint) bool {
	minX, maxX := p1.X, p2.X
	if p1.X > p2.X {
		minX, maxX = p2.X, p1.X
	}
	minY, maxY := p1.Y, p2.Y
	if p1.Y > p2.Y {
		minY, maxY = p2.Y, p1.Y
	}

	// Check perimeter first for early exit (much faster)
	// Top and bottom edges
	for x := minX; x <= maxX; x++ {
		if grid.Get(x, minY) == 0 || grid.Get(x, maxY) == 0 {
			return false
		}
	}
	// Left and right edges (skip corners already checked)
	for y := minY + 1; y < maxY; y++ {
		if grid.Get(minX, y) == 0 || grid.Get(maxX, y) == 0 {
			return false
		}
	}

	// Check interior
	for y := minY + 1; y < maxY; y++ {
		for x := minX + 1; x < maxX; x++ {
			if grid.Get(x, y) == 0 {
				return false
			}
		}
	}
	return true
}

func (m *Problem) Solve(lines []string) int {
	redTiles := []TPoint{}
	for _, line := range lines {
		coords := strings.Split(line, ",")
		redTiles = append(redTiles, TPoint{X: eulerlib.StrToInt(coords[0]), Y: eulerlib.StrToInt(coords[1])})
	}

	maxX := 0
	maxY := 0
	for _, redTile := range redTiles {
		if redTile.X > maxX {
			maxX = redTile.X
		}
		if redTile.Y > maxY {
			maxY = redTile.Y
		}
	}
	fmt.Println("grid size", maxX+1, maxY+1)
	grid := eulerlib.NewCompactGrid(maxX+1, maxY+1)
	fmt.Println("drawing lines")
	for i, redTile := range redTiles {
		grid.Set(redTile.X, redTile.Y, 1) // 1 = 'R'
		nextRed := redTiles[(i+1)%len(redTiles)]
		if nextRed.X-redTile.X != 0 {
			start := redTile.X + 1
			end := nextRed.X - 1
			if nextRed.X-redTile.X < 0 {
				start = nextRed.X + 1
				end = redTile.X - 1
			}
			for x := start; x <= end; x++ {
				grid.Set(x, redTile.Y, 2) // 2 = 'G' boundary
			}
		} else {
			start := redTile.Y + 1
			end := nextRed.Y - 1
			if nextRed.Y-redTile.Y < 0 {
				start = nextRed.Y + 1
				end = redTile.Y - 1
			}
			for y := start; y <= end; y++ {
				grid.Set(redTile.X, y, 2) // 2 = 'G' boundary
			}
		}
	}

	if eulerlib.GetDebugger().IsDebug() {
		fmt.Println(grid.ToString(0, maxX, 0, maxY))
	}
	fmt.Println("filling enclosed area")
	count := grid.FillEnclosedArea(0, maxX, 0, maxY, 2, map[byte]bool{1: true, 2: true}) // 1='R', 2='G'
	fmt.Println("filled", count, "spaces")

	if eulerlib.GetDebugger().IsDebug() {
		fmt.Println(grid.ToString(0, maxX, 0, maxY))
	}

	fmt.Println("checking rectangles")
	max := 0
	count = 0
	for i, t1 := range redTiles {
		for j := i + 1; j < len(redTiles); j++ {
			t2 := redTiles[j]
			count++
			if m.IsRectangleEnclosed(grid, t1, t2) {
				area := (eulerlib.IntAbs(t1.X-t2.X) + 1) * (eulerlib.IntAbs(t1.Y-t2.Y) + 1)
				if area > max {
					max = area
				}
			}
			if count%100000 == 0 {
				fmt.Println(count)
			}
		}
	}
	return max
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
