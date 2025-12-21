# aoc2025 solutions

- **`solutions/`** – the solutions written in golang
- **`solutions/dayX-Y/`** – per-day solution packages (for example `day1-2`, `day2-1`, `day2-2`) each with:
  - `main.go` – entrypoint for that part.
  - `main_test.go` – test harness for that part.
  - `input.txt` / `input-test.txt` – puzzle input and sample input.

## Running solutions
 
Each day/part is a separate `main` package. E.g. from the repo root:
 
```bash
cd solutions/day1-2
go run .
```
 
Each program can read `input.txt` (or `input-test.txt` for the short answer) from the current directory and all programs print the computed answer.

`go test` will run the sample (where the output is known ahead of time) and `go run .` will run the main input provided to get the answer that needs to be submitted on https://adventofcode.com/
 
## Running tests
 
Run tests for a single package, for example:
 
```bash
cd lib && go test
cd day1-2/ && go test
```
 
Or run **all tests** in the module (includes the lib package):
 
```bash
./testall.sh
```
 
or run `go test ./...` to only test the day-by-day folders.

## Using `eulerlib.Problem`

### Benefits

- **Consistent interface** – every day exposes the same methods (`GetProblemName`, `GenerateAnswer`, etc.), which keeps `main.go` and tests uniform across the repo.
- **Shared I/O helpers** – you can rely on `eulerlib.GetFileInputTxt`, `StrToInt`, `IntToStr`, and other utilities instead of re‑writing parsing code.
- **Standardised testing** – the `lib/tests.go` helpers (`TestProblem`, `testShortProblem`, `testLongProblem`) work with any type that implements `Problem`, so adding tests for a new day is straightforward.
- **Support for “short” answers** – for expensive problems, you can implement the short-answer methods to allow fast verification on small inputs while still having a full solution for the real input.

### Solving a new `eulerlib.Problem`

Each day/part typically defines a `Day` struct that implements `eulerlib.Problem`. A minimal pattern is:

```go
package main

import (
    "fmt"

    eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
    eulerlib.Problem
}

func (p *Problem) GetProblemName() string      { return "Day X, Part Y" }
func (p *Problem) GetAnswer() string           { return "<known-correct-answer>" }
func (p *Problem) GetShortAnswer() string      { return "<known-correct-sample-answer>" } // optional
func (p *Problem) GenerateAnswer() string      { return eulerlib.IntToStr(p.Solve(eulerlib.GetFileInputTxt("input.txt"))) }
func (p *Problem) GenerateShortAnswer() string { return eulerlib.IntToStr(p.Solve(eulerlib.GetFileInputTxt("input-test.txt"))) }

func (p *Problem) Solve(lines []string) int {
    // TODO: implement solution logic
    return 0
}

func main() {
    p := Problem{}
    fmt.Println(p.GenerateAnswer())
}
```

### Testing a new `eulerlib.Problem`

For a new folder like `day3-1/`, you can add a minimal `main_test.go`:

```go
package main

import (
    "testing"

    eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

func TestDay(t *testing.T) {
    p := &Problem{}
    eulerlib.TestProblem(p, t)
}
```

`TestProblem` will automatically choose between the short and long answer based on whether `GetShortAnswer` returns an empty string, so you get consistent verification across all days with one small test file.

