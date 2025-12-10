package main

import (
	"fmt"
	"slices"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 8, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "673096646"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt"), 1000))
}

func (m *Problem) GetShortAnswer() string {
	return "25272"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt"), 10))
}

func (m *Problem) parseBoxes(lines []string) eulerlib.ThreedCoords {
	boxes := eulerlib.ThreedCoords{}
	for _, line := range lines {
		box := eulerlib.ThreedCoord{}
		vals := strings.Split(line, ",")
		box.X = eulerlib.StrToInt(vals[0])
		box.Y = eulerlib.StrToInt(vals[1])
		box.Z = eulerlib.StrToInt(vals[2])
		boxes = append(boxes, box)
	}
	return boxes
}

func (m *Problem) getCircuitsUntilSingleCircuit(distances eulerlib.ThreedDistances, minIterations int, totalBoxes int) eulerlib.ThreedDistance {
	circuits := eulerlib.ThreedCircuits{}
	iterations := 0
	for _, d := range distances {
		iterations++

		var fromCircuit *eulerlib.ThreedCircuit
		var toCircuit *eulerlib.ThreedCircuit
		fromCircuitIdx := -1
		toCircuitIdx := -1

		// find which circuits contain From and To
		for i, c := range circuits {
			if fromCircuit == nil && c.IsInCircuit(d.From) {
				fromCircuit = c
				fromCircuitIdx = i
			}
			if toCircuit == nil && c.IsInCircuit(d.To) {
				toCircuit = c
				toCircuitIdx = i
			}
			// optimization: if we found both, we can stop searching
			if fromCircuit != nil && toCircuit != nil {
				break
			}
		}

		// both in same circuit - do nothing
		if fromCircuit != nil && toCircuit != nil && fromCircuitIdx == toCircuitIdx {
		} else if fromCircuit != nil && toCircuit != nil && fromCircuitIdx != toCircuitIdx {
			// both in different circuits - merge them

			// add all nodes from toCircuit to fromCircuit
			for node := toCircuit; node != nil; node = node.Next {
				if !fromCircuit.IsInCircuit(node.Start) {
					fromCircuit.Add(node.Start)
				}
			}

			// remove toCircuit from the list
			circuits = slices.Delete(circuits, toCircuitIdx, toCircuitIdx+1)
		} else if fromCircuit != nil && toCircuit == nil {
			// only From found - add To to that circuit
			fromCircuit.Add(d.To)
		} else if toCircuit != nil && fromCircuit == nil {
			// only To found - add From to that circuit
			toCircuit.Add(d.From)
		} else {
			// neither found - create new circuit
			newCircuit := eulerlib.ThreedCircuit{Start: d.From}
			newCircuit.Add(d.To)
			circuits = append(circuits, &newCircuit)
		}

		// check if we have a single circuit with ALL boxes and reached minIterations
		// the total box matters, we are only keeping track of connected boxes whereas
		// the language of the puzzle talks about all boxes being in a single circuit
		if len(circuits) == 1 && circuits[0].GetLength() == totalBoxes && iterations >= minIterations {
			fmt.Println("found on iteration", iterations, d.From, d.To, "circuit length:", circuits[0].GetLength())
			return d
		}
	}
	return eulerlib.ThreedDistance{From: &eulerlib.ThreedCoord{X: 0, Y: 0, Z: 0}, To: &eulerlib.ThreedCoord{X: 0, Y: 0, Z: 0}, Distance: 0}
}

func (m *Problem) Solve(lines []string, numIterations int) int {
	boxes := m.parseBoxes(lines)
	distances := boxes.GetUniqueDistances()
	distances = *distances.SortByDistance()
	fmt.Println("we have", len(distances), "distances")
	fmt.Println("we have", len(boxes), "boxes")

	lastDistance := m.getCircuitsUntilSingleCircuit(distances, numIterations, len(boxes))
	fmt.Println("last distance from:", lastDistance.From)
	fmt.Println("last distance to:", lastDistance.To)

	return lastDistance.From.X * lastDistance.To.X
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
