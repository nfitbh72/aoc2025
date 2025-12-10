package eulerlib

import (
	"fmt"
	"math"
	"sort"
)

type ThreedCoord struct {
	X int
	Y int
	Z int
}

func (m *ThreedCoord) EuclideanDistance(other *ThreedCoord) float64 {
	return math.Sqrt(math.Pow(float64(m.X-other.X), 2) + math.Pow(float64(m.Y-other.Y), 2) + math.Pow(float64(m.Z-other.Z), 2))
}

func (m *ThreedCoord) IsEqual(other *ThreedCoord) bool {
	if m == nil || other == nil {
		return false
	}
	return m.X == other.X && m.Y == other.Y && m.Z == other.Z
}

type ThreedCoords []ThreedCoord

type ThreedDistance struct {
	From     *ThreedCoord
	To       *ThreedCoord
	Distance float64
}

type ThreedDistances []ThreedDistance

func (m *ThreedCoords) GetAllDistances() ThreedDistances {
	distances := []ThreedDistance{}
	coords := *m

	for i := range coords {
		for j := range coords {
			if i != j {
				distances = append(distances, ThreedDistance{
					From:     &coords[i],
					To:       &coords[j],
					Distance: coords[i].EuclideanDistance(&coords[j]),
				})
			}
		}
	}
	return distances
}

func (m *ThreedCoords) GetUniqueDistances() ThreedDistances {
	distances := []ThreedDistance{}
	coords := *m
	cache := map[string]bool{}

	for i := range coords {
		for j := range coords {
			if i != j {
				// create a cache key using the smaller index first to avoid duplicates
				var key string
				if i < j {
					key = fmt.Sprintf("%d-%d", i, j)
				} else {
					key = fmt.Sprintf("%d-%d", j, i)
				}

				// only add if we haven't seen this pair before
				if !cache[key] {
					cache[key] = true
					distances = append(distances, ThreedDistance{
						From:     &coords[i],
						To:       &coords[j],
						Distance: coords[i].EuclideanDistance(&coords[j]),
					})
				}
			}
		}
	}
	return distances
}

func (m *ThreedDistances) SortByDistance() *ThreedDistances {
	distances := *m
	sort.Slice(distances, func(i, j int) bool {
		return distances[i].Distance < distances[j].Distance
	})
	return &distances
}

func (m *ThreedDistances) ToString() string {
	result := ""
	for _, d := range *m {
		result += fmt.Sprintf("%v -> %v = %v\n", d.From, d.To, d.Distance)
	}
	return result
}

type ThreedCircuit struct {
	Start *ThreedCoord
	Next  *ThreedCircuit
}

func (m *ThreedCircuit) Add(c *ThreedCoord) {
	circuit := &ThreedCircuit{Start: c, Next: m.Next}
	m.Next = circuit
}

func (m *ThreedCircuit) IsInCircuit(c *ThreedCoord) bool {
	for me := m; me != nil; me = me.Next {
		if me.Start.IsEqual(c) {
			return true
		}
	}
	return false
}

func (m *ThreedCircuit) GetLength() int {
	count := 0
	for me := m; me != nil; me = me.Next {
		count++
	}
	return count
}

func (m *ThreedCircuit) ToString() string {
	result := ""
	for me := m; me != nil; me = me.Next {
		result += fmt.Sprintf("%v\n", me.Start)
	}
	result += "\n"
	return result
}

type ThreedCircuits []*ThreedCircuit

func (m *ThreedCircuits) SortByLengthDesc() *ThreedCircuits {
	circuits := *m
	sort.Slice(circuits, func(i, j int) bool {
		return circuits[i].GetLength() > circuits[j].GetLength()
	})
	return &circuits
}

func (m *ThreedCircuits) Get(i int) *ThreedCircuit {
	return (*m)[i]
}

func (m *ThreedCircuits) GetAll() []*ThreedCircuit {
	return *m
}

func (m *ThreedCircuits) ToString() string {
	result := ""
	for _, c := range *m {
		result += fmt.Sprintf("circuit has length %d:\n", c.GetLength())
		result += c.ToString()
	}
	return result
}
