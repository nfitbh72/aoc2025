# Algorithm Refactor Ideas

## Current Approach Issues
- **O(n²)** rectangle checking: 495 tiles = 122,265 pairs
- Each check scans potentially thousands of cells
- Total complexity: O(n² × area) = billions of operations

## Alternative Approaches

### 1. **Prefix Sum / 2D Range Query** ⭐ BEST
Pre-compute cumulative sums to check if rectangle is filled in O(1).

**Algorithm:**
```
1. Build 2D prefix sum array where prefixSum[y][x] = count of filled cells in rectangle (0,0) to (x,y)
2. For any rectangle (x1,y1) to (x2,y2):
   filled_count = prefixSum[y2][x2] - prefixSum[y1-1][x2] - prefixSum[y2][x1-1] + prefixSum[y1-1][x1-1]
3. Rectangle is enclosed if filled_count == (width × height)
```

**Complexity:**
- Preprocessing: O(W × H) - one pass through grid
- Per rectangle check: O(1)
- Total: O(W × H + n²) vs current O(n² × W × H)

**Memory:** O(W × H) for prefix sum array (int32 = ~40MB for 100k×100k)

### 2. **Spatial Indexing with R-Tree**
Build spatial index of filled regions, query for rectangles.

**Algorithm:**
```
1. After flood fill, identify contiguous filled regions
2. Build R-tree of filled rectangular regions
3. For each tile pair, query R-tree to see if rectangle is covered
```

**Complexity:** O(n² × log(regions))
**Pros:** Good for sparse fills
**Cons:** Complex implementation, overkill for this problem

### 3. **Sweep Line with Interval Trees**
Process rectangles by sweeping horizontally, maintaining active intervals.

**Algorithm:**
```
1. Sort all potential rectangles by area (descending)
2. Use sweep line to check if each rectangle is valid
3. Stop when first valid rectangle found (if only need max)
```

**Complexity:** O(n² log n + n² × H)
**Pros:** Can early exit if only need maximum
**Cons:** Still relatively slow

### 4. **Dynamic Programming on Largest Rectangle**
Find largest rectangle of filled cells directly (classic problem).

**Algorithm:**
```
1. For each row, compute histogram of consecutive filled cells
2. Use stack-based algorithm to find largest rectangle in histogram
3. Process all rows to find global maximum
```

**Complexity:** O(W × H)
**Pros:** Optimal complexity, finds answer directly
**Cons:** Doesn't constrain corners to red tiles (may need modification)

### 5. **Constraint: Corners Must Be Red Tiles**
If problem requires rectangle corners to be red tiles specifically:

**Modified Prefix Sum:**
```
1. Build prefix sum as in approach #1
2. Only check rectangles where both corners are red tiles
3. O(1) check per valid pair
```

## Recommended Implementation

### **Prefix Sum Approach (Best for this problem)**

```go
type PrefixSumGrid struct {
    sums [][]int
    width, height int
}

func NewPrefixSumGrid(grid *CompactGrid, width, height int) *PrefixSumGrid {
    sums := make([][]int, height+1)
    for i := range sums {
        sums[i] = make([]int, width+1)
    }
    
    // Build prefix sum
    for y := 1; y <= height; y++ {
        for x := 1; x <= width; x++ {
            val := 0
            if grid.Get(x-1, y-1) != 0 { // non-zero = filled
                val = 1
            }
            sums[y][x] = val + sums[y-1][x] + sums[y][x-1] - sums[y-1][x-1]
        }
    }
    
    return &PrefixSumGrid{sums: sums, width: width, height: height}
}

func (p *PrefixSumGrid) IsRectangleFilled(x1, y1, x2, y2 int) bool {
    // Ensure x1 <= x2, y1 <= y2
    if x1 > x2 { x1, x2 = x2, x1 }
    if y1 > y2 { y1, y2 = y2, y1 }
    
    // Convert to 1-indexed for prefix sum
    x1++; y1++; x2++; y2++
    
    area := (x2 - x1 + 1) * (y2 - y1 + 1)
    filled := p.sums[y2][x2] - p.sums[y1-1][x2] - p.sums[y2][x1-1] + p.sums[y1-1][x1-1]
    
    return filled == area
}
```

**Usage:**
```go
// After flood fill
prefixGrid := NewPrefixSumGrid(grid, maxX+1, maxY+1)

max := 0
for i, t1 := range redTiles {
    for j := i + 1; j < len(redTiles); j++ {
        t2 := redTiles[j]
        if prefixGrid.IsRectangleFilled(t1.X, t1.Y, t2.X, t2.Y) {
            area := (abs(t1.X-t2.X) + 1) * (abs(t1.Y-t2.Y) + 1)
            if area > max {
                max = area
            }
        }
    }
}
```

## Performance Comparison

| Approach | Preprocessing | Per Check | Total (495 tiles) |
|----------|--------------|-----------|-------------------|
| Current (scan each) | 0 | O(W×H) | ~billions |
| Prefix Sum | O(W×H) | O(1) | ~100M + 122k |
| Perimeter only | 0 | O(W+H) | ~millions |
| DP Largest Rect | O(W×H) | - | ~100M (direct) |

**Speedup:** Prefix sum should be **1000-10000× faster** than current approach.

## Other Optimizations

### Parallel Processing
```go
// Process rectangle checks in parallel
results := make(chan int, runtime.NumCPU())
var wg sync.WaitGroup

for i := 0; i < runtime.NumCPU(); i++ {
    wg.Add(1)
    go func(start int) {
        defer wg.Done()
        localMax := 0
        for idx := start; idx < len(pairs); idx += runtime.NumCPU() {
            // check rectangle
        }
        results <- localMax
    }(i)
}
```

### Early Exit by Area
```go
// Sort pairs by potential area (descending)
// Stop when current max > remaining possible areas
```

### Bounding Box Pruning
```go
// Skip rectangles that extend outside filled region bounds
if x1 < fillMinX || x2 > fillMaxX || y1 < fillMinY || y2 > fillMaxY {
    continue
}
```
