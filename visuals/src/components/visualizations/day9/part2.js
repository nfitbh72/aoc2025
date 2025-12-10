import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { GridRenderer, parseInput, calculateArea, getGridBounds, COLORS, EMOJIS } from './common.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 9 Part 2 visualization - Finding largest rectangle within enclosed area
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let gridRenderer = null;
  let animationFrame = null;
  
  // Test input
  const input = PART2_CONFIG.TEST_INPUT;
  
  const points = parseInput(input);
  const { maxX, maxY } = getGridBounds(points);
  
  // Create grid (0=empty, 1=red corners, 2=green boundary lines, 3=green fill)
  // Grid dimensions match Go: 0 to maxX, 0 to maxY
  const grid = [];
  for (let y = 0; y <= maxY; y++) {
    grid[y] = new Array(maxX + 1).fill(PART2_CONFIG.GRID_EMPTY);
  }
  
  // Draw boundaries between consecutive points (matching Go implementation)
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    // Set corner points to red
    grid[p1.y][p1.x] = PART2_CONFIG.GRID_RED_CORNER;
    
    // Draw green line between points (excluding endpoints)
    if (p1.x === p2.x) {
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);
      for (let y = minY + 1; y < maxY; y++) {
        grid[y][p1.x] = PART2_CONFIG.GRID_GREEN_BOUNDARY;
      }
    } else {
      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      for (let x = minX + 1; x < maxX; x++) {
        grid[p1.y][x] = PART2_CONFIG.GRID_GREEN_BOUNDARY;
      }
    }
  }
  
  // Flood fill enclosed area (matching Go: both red and green boundaries toggle inside/outside)
  function floodFill() {
    for (let y = 0; y <= maxY; y++) {
      let inside = false;
      let lastBoundary = false;
      
      for (let x = 0; x <= maxX; x++) {
        // Both red corners and green boundaries toggle inside/outside
        const isBoundary = grid[y][x] === PART2_CONFIG.GRID_RED_CORNER || 
                          grid[y][x] === PART2_CONFIG.GRID_GREEN_BOUNDARY;
        
        if (isBoundary) {
          if (!lastBoundary) {
            inside = !inside;
          }
          lastBoundary = true;
        } else {
          lastBoundary = false;
          if (inside && grid[y][x] === PART2_CONFIG.GRID_EMPTY) {
            grid[y][x] = PART2_CONFIG.GRID_GREEN_FILLED;
          }
        }
      }
    }
  }
  
  floodFill();
  
  // Create UI components
  counterBox = new CounterBox(container, PART2_CONFIG.COUNTER_LABEL_CHECKING);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create grid renderer with larger cell size
  const cellSize = Math.min(COMMON_CONFIG.MAX_CELL_SIZE, Math.floor(COMMON_CONFIG.BASE_CANVAS_SIZE / Math.max(maxX, maxY)));
  gridRenderer = new GridRenderer(container, maxX + 1, maxY + 1, cellSize);
  
  // Animation state
  let phase = 'line-drawing'; // line-drawing, filling, checking, celebrating, complete
  let lineDrawIndex = 0;
  let lineDrawFrameCounter = 0;
  let fillProgress = 0;
  let fillFrameCounter = 0;
  let checkIndex = 0;
  let frameCounter = 0;
  const framesPerCheck = COMMON_CONFIG.FRAMES_PER_CHECK;
  let celebrationFrame = 0;
  let maxArea = 0;
  let bestPair = null;
  const pairs = [];
  
  // Track cells for animation
  const lineCells = [];
  const fillCells = [];
  
  // Collect line cells in order
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    if (p1.x === p2.x) {
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);
      for (let y = minY + 1; y < maxY; y++) {
        lineCells.push({ x: p1.x, y });
      }
    } else {
      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      for (let x = minX + 1; x < maxX; x++) {
        lineCells.push({ x, y: p1.y });
      }
    }
  }
  
  // Collect fill cells
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (grid[y][x] === PART2_CONFIG.GRID_GREEN_FILLED) {
        fillCells.push({ x, y });
      }
    }
  }
  
  // Generate all pairs
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      pairs.push([i, j]);
    }
  }
  
  function isRectangleEnclosed(x1, y1, x2, y2) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (grid[y][x] === PART2_CONFIG.GRID_EMPTY) return false;
      }
    }
    return true;
  }
  
  function animate() {
    gridRenderer.clear();
    gridRenderer.drawSnowflakes();
    gridRenderer.drawGrid();
    
    if (phase === 'line-drawing') {
      // Draw red corners
      points.forEach(p => {
        gridRenderer.drawPoint(p.x, p.y, PART2_CONFIG.BOUNDARY_COLOR, PART2_CONFIG.BOUNDARY_EMOJI_DRAWING);
      });
      
      // Progressively draw green boundary lines with emojis
      for (let i = 0; i < Math.min(lineDrawIndex, lineCells.length); i++) {
        const cell = lineCells[i];
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      }
      
      lineDrawFrameCounter++;
      if (lineDrawFrameCounter >= PART2_CONFIG.LINE_DRAW_FRAMES_PER_CELL) {
        lineDrawFrameCounter = 0;
        lineDrawIndex++;
      }
      
      if (lineDrawIndex > lineCells.length) {
        setTimeout(() => { phase = 'filling'; }, PART2_CONFIG.DRAWING_PHASE_DELAY_MS);
      }
      
    } else if (phase === 'filling') {
      // Draw red corners
      points.forEach(p => {
        gridRenderer.drawPoint(p.x, p.y, PART2_CONFIG.BOUNDARY_COLOR, PART2_CONFIG.BOUNDARY_EMOJI_DRAWING);
      });
      
      // Draw all green boundary lines with emojis
      lineCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      // Progressively fill interior with emojis
      for (let i = 0; i < Math.min(fillProgress, fillCells.length); i++) {
        const cell = fillCells[i];
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      }
      
      fillFrameCounter++;
      if (fillFrameCounter >= PART2_CONFIG.FILL_FRAMES_PER_CELL) {
        fillFrameCounter = 0;
        fillProgress++;
      }
      
      if (fillProgress > fillCells.length) {
        setTimeout(() => { phase = 'checking'; }, PART2_CONFIG.FILLING_PHASE_DELAY_MS);
      }
      
    } else if (phase === 'checking' && checkIndex < pairs.length) {
      // Draw red corners
      points.forEach(p => {
        gridRenderer.drawPoint(p.x, p.y, PART2_CONFIG.BOUNDARY_COLOR, PART2_CONFIG.BOUNDARY_EMOJI_DRAWING);
      });
      
      // Draw all green boundary lines with emojis
      lineCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      // Draw all filled cells with emojis
      fillCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      const [i, j] = pairs[checkIndex];
      const p1 = points[i];
      const p2 = points[j];
      
      if (isRectangleEnclosed(p1.x, p1.y, p2.x, p2.y)) {
        const area = calculateArea(p1, p2);
        
        // Draw enclosed rectangle in gold
        gridRenderer.drawRectangle(
          p1.x, p1.y, p2.x, p2.y,
          PART2_CONFIG.CHECKING_RECT_COLOR,
          PART2_CONFIG.CHECKING_RECT_STROKE
        );
        
        // Always show current enclosed rectangle area
        counterBox.setValue(area);
        
        // Track if this is a new maximum
        if (area > maxArea) {
          maxArea = area;
          bestPair = [i, j];
        }
      } else {
        // Draw non-enclosed rectangle in red
        gridRenderer.drawRectangle(
          p1.x, p1.y, p2.x, p2.y,
          'rgba(255, 107, 107, 0.2)',
          '#ff6b6b'
        );
        
        // Set counter to 0 for non-enclosed rectangles
        counterBox.setValue(0);
      }
      
      // Only advance every N frames for slower animation
      frameCounter++;
      if (frameCounter >= framesPerCheck) {
        frameCounter = 0;
        checkIndex++;
      }
      
      if (checkIndex >= pairs.length) {
        phase = 'celebrating';
        celebrationFrame = 0;
        counterBox.setLabel(PART2_CONFIG.COUNTER_LABEL_FINAL);
      }
      
    } else if (phase === 'celebrating' && bestPair) {
      // Draw all green boundary lines with emojis
      lineCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      // Draw all filled cells with emojis
      fillCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      const [i, j] = bestPair;
      const p1 = points[i];
      const p2 = points[j];
      
      // Draw pulsing winning rectangle using common method
      gridRenderer.drawPulsingRectangle(p1.x, p1.y, p2.x, p2.y, celebrationFrame, PART2_CONFIG.WINNING_RECT_STROKE);
      
      // Draw Christmas trees at winning corners
      gridRenderer.drawPoint(p1.x, p1.y, PART2_CONFIG.WINNING_RECT_STROKE, PART2_CONFIG.WINNING_EMOJI);
      gridRenderer.drawPoint(p2.x, p2.y, PART2_CONFIG.WINNING_RECT_STROKE, PART2_CONFIG.WINNING_EMOJI);
      
      // Draw bells at other boundary points
      points.forEach((p, idx) => {
        if (idx !== i && idx !== j) {
          gridRenderer.drawPoint(p.x, p.y, COLORS.GOLD, PART2_CONFIG.BOUNDARY_EMOJI_FINAL);
        }
      });
      
      celebrationFrame++;
      
      // After celebration frames, move to complete
      if (celebrationFrame >= COMMON_CONFIG.CELEBRATION_FRAMES) {
        phase = 'complete';
      }
      
    } else if (phase === 'complete' && bestPair) {
      // Draw all green boundary lines with emojis
      lineCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      // Draw all filled cells with emojis
      fillCells.forEach(cell => {
        gridRenderer.drawPoint(cell.x, cell.y, COLORS.GREEN, '🎄');
      });
      
      const [i, j] = bestPair;
      const p1 = points[i];
      const p2 = points[j];
      
      // Draw final static winning rectangle
      gridRenderer.drawRectangle(
        p1.x, p1.y, p2.x, p2.y,
        PART2_CONFIG.WINNING_RECT_COLOR,
        PART2_CONFIG.WINNING_RECT_STROKE
      );
      
      // Draw Christmas trees at corners
      gridRenderer.drawPoint(p1.x, p1.y, PART2_CONFIG.WINNING_RECT_STROKE, PART2_CONFIG.WINNING_EMOJI);
      gridRenderer.drawPoint(p2.x, p2.y, PART2_CONFIG.WINNING_RECT_STROKE, PART2_CONFIG.WINNING_EMOJI);
      
      // Draw bells at other boundary points
      points.forEach((p, idx) => {
        if (idx !== i && idx !== j) {
          gridRenderer.drawPoint(p.x, p.y, COLORS.GOLD, PART2_CONFIG.BOUNDARY_EMOJI_FINAL);
        }
      });
    }
    
    if (phase !== 'complete') {
      animationFrame = requestAnimationFrame(animate);
    } else if (phase === 'complete' && !fireworks) {
      counterBox.markComplete();
      fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
      if (onComplete) {
        setTimeout(onComplete, COMMON_CONFIG.COMPLETION_CALLBACK_DELAY_MS);
      }
    }
  }
  
  // Start animation
  setTimeout(() => {
    animate();
  }, PART2_CONFIG.INITIAL_ANIMATION_DELAY_MS);
  
  return {
    cleanup: () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (fireworks) fireworks.cleanup();
      if (gridRenderer) gridRenderer.cleanup();
    }
  };
}
