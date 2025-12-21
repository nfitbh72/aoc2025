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
	return "Day 11, Part 2"
}

func (m *Problem) GetAnswer() string {
	return "4725826296"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "2"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

type TRoutes struct {
	routes []string
}

type TServer struct {
	devices      map[string][]string
	destination  string
	numChecks    int
	cache        map[string]TRoutes
	numCacheHits int
	UseCache     bool
}

func (m *TServer) Init(dest string) {
	m.destination = dest
	m.devices = make(map[string][]string, 0)
	m.cache = make(map[string]TRoutes)
}

func (m *TServer) SetupNewDevice(label string) {
	r := TRoutes{}
	r.routes = make([]string, 0)
	a := make([]string, 0)
	m.devices[label] = a
}

func (m *TServer) LoadConnection(forDevice, toDevice string) {
	m.devices[forDevice] = append(m.devices[forDevice], toDevice)
}

func (m *Problem) ParseInput(lines []string, startAt string) *TServer {
	s := TServer{}
	s.Init(startAt)
	for _, line := range lines {
		parts := strings.Split(line, ": ")
		label := parts[0]
		s.SetupNewDevice(label)
	}
	for _, line := range lines {
		parts := strings.Split(line, ": ")
		label := parts[0]
		connectionParts := strings.Split(parts[1], " ")
		for _, connection := range connectionParts {
			s.LoadConnection(label, connection)
		}
	}
	return &s
}

func (m *TServer) Display() {
	fmt.Println("Server:")
	for k, d := range m.devices {
		fmt.Println(k, d)
	}
}

func (m *TServer) GetCache(from string) TRoutes {
	if v, ok := m.cache[from]; ok {
		m.numCacheHits++
		return v
	} else {
		return TRoutes{}
	}
}

func (m *TServer) AddToCache(from string, result TRoutes) {
	m.cache[from] = result
}

func (m *TServer) GetRoutes(from string) TRoutes {
	m.numChecks++

	if m.UseCache {
		cachedRoutes := m.GetCache(from)
		if cachedRoutes.routes != nil {
			return cachedRoutes
		}
	}
	routes := TRoutes{}
	routes.routes = make([]string, 0)
	for _, connection := range m.devices[from] {
		if connection == m.destination {
			routes.routes = append(routes.routes, "_"+from)
		} else {
			newRoutes := m.GetRoutes(connection)
			newRoutes2 := TRoutes{}
			newRoutes2.routes = make([]string, len(newRoutes.routes))
			for i, r := range newRoutes.routes {
				newRoutes2.routes[i] = "_" + from + r
			}
			routes.routes = append(routes.routes, newRoutes2.routes...)
		}
	}
	if m.UseCache {
		m.AddToCache(from, routes)
	}

	if m.numChecks%10000000 == 0 {
		fmt.Println("checks", m.numChecks, "hits", m.numCacheHits)
	}
	return routes
}

/*
	func (m *TServer) GetNumPaths(from string, hasDac, hasFft bool, depth int) int {
		m.numChecks++

		if m.numChecks%10000000 == 0 {
			fmt.Println("checked", m.numChecks, "current depth", depth)
		}
		if connections, ok := m.devices[from]; ok {
			numPaths := 0
			depth++
			for _, connection := range connections {
				//fmt.Println("checking", from, connection)
				if connection == m.destination {
					if hasDac && hasFft {
						fmt.Println("path found from", from)
						numPaths++
					}
				} else {
					switch connection {
					case "dac":
						hasDac = true
					case "fft":
						hasFft = true
					}
					numPaths += m.GetNumPaths(connection, hasDac, hasFft, depth)
				}
				if from == "svr" {
					fmt.Println(connection, "has", numPaths, "paths")
				}
			}
			if depth > 100 {
				fmt.Println(from, "has", depth, "depth so far")
			}
			return numPaths
		} else {
			panic(from + " key missing")
		}
	}
*/
func (m *Problem) Solve(lines []string) int {
	server := m.ParseInput(lines, "out")

	fmt.Println("Server loaded, finding routes")
	//server.UseCache = true
	routes := server.GetRoutes("svr")
	if eulerlib.GetDebugger().IsDebug() {
		server.Display()
		fmt.Println()
		fmt.Println("routes:")
		for _, r := range routes.routes {
			fmt.Println(r)
		}

		for k, c := range server.cache {
			fmt.Println(k, ":")
			for _, r := range c.routes {
				fmt.Println("\t", r)
			}
		}
		fmt.Println()
	}

	numPaths := 0
	for _, route := range routes.routes {
		if strings.Contains(route, "dac") && strings.Contains(route, "fft") {
			numPaths++
			if eulerlib.GetDebugger().IsDebug() {
				fmt.Println("Route with dac and fft:", route)
			}
		}
	}
	return numPaths
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
