/**
 * Day 9 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Grid rendering
  MAX_CELL_SIZE: 60,
  BASE_CANVAS_SIZE: 800,
  GRID_PADDING: 2, // Extra cells around the grid
  
  // Snowflakes
  SNOWFLAKE_COUNT: 30,
  SNOWFLAKE_MIN_RADIUS: 1,
  SNOWFLAKE_MAX_RADIUS: 3,
  SNOWFLAKE_MIN_SPEED: 0.5,
  SNOWFLAKE_MAX_SPEED: 1.5,
  SNOWFLAKE_MAX_DRIFT: 0.5,
  
  // Animation timing
  FRAMES_PER_CHECK: 30, // Slow down rectangle checking
  CELEBRATION_FRAMES: 180, // 3 seconds at 60fps
  
  // Pulsing animation
  PULSE_SPEED: 0.1,
  PULSE_SCALE_AMPLITUDE: 0.02, // ±2% size variation
  PULSE_ALPHA_BASE: 0.3,
  PULSE_ALPHA_AMPLITUDE: 0.2,
  
  // Delays
  INITIAL_DELAY_MS: 1000,
  PHASE_TRANSITION_DELAY_MS: 1000,
  FIREWORKS_DURATION_MS: 5000,
  COMPLETION_CALLBACK_DELAY_MS: 1000,
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎁 Finding the largest rectangle between any two gift boxes! 🎁',
  COUNTER_LABEL: 'Largest Rectangle Area',
  
  // Test input
  TEST_INPUT: [
    '7,1', '11,1', '11,7', '9,7',
    '9,5', '2,5', '2,3', '7,3'
  ],
  
  // Colors
  GIFT_BOX_COLOR: '#ff6b6b', // Red
  CHECKING_RECT_COLOR: 'rgba(255, 215, 0, 0.2)', // Gold with transparency
  CHECKING_RECT_STROKE: '#ffd700', // Gold
  WINNING_RECT_COLOR: 'rgba(76, 175, 80, 0.3)', // Green with transparency
  WINNING_RECT_STROKE: '#4caf50', // Green
  
  // Emojis
  GIFT_EMOJI: '🎁',
  CHECKING_EMOJI: '⭐',
  WINNING_EMOJI: '🎄',
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '❄️ Drawing boundaries, filling enclosed area, and finding the largest rectangle inside! 🎄',
  COUNTER_LABEL_CHECKING: 'Current Enclosed Rectangle',
  COUNTER_LABEL_FINAL: 'Largest Enclosed Rectangle',
  
  // Test input
  TEST_INPUT: [
    '7,1', '11,1', '11,7', '9,7',
    '9,5', '2,5', '2,3', '7,3'
  ],
  
  // Grid values (matching Go implementation)
  GRID_EMPTY: 0,
  GRID_RED_CORNER: 1,      // Red corner points
  GRID_GREEN_BOUNDARY: 2,  // Green boundary lines
  GRID_GREEN_FILLED: 3,    // Green filled interior
  
  // Colors
  BOUNDARY_COLOR: '#ff6b6b', // Red
  FILLED_AREA_COLOR: 'rgba(76, 175, 80, 0.4)', // Green with transparency
  FILLED_AREA_COLOR_LIGHT: 'rgba(76, 175, 80, 0.3)', // Lighter green
  FILLED_AREA_COLOR_FINAL: 'rgba(76, 175, 80, 0.2)', // Even lighter for final
  CHECKING_RECT_COLOR: 'rgba(255, 215, 0, 0.3)', // Gold with transparency
  CHECKING_RECT_STROKE: '#ffd700', // Gold
  WINNING_RECT_COLOR: 'rgba(76, 175, 80, 0.3)', // Green with transparency
  WINNING_RECT_STROKE: '#4caf50', // Green
  
  // Emojis
  BOUNDARY_EMOJI_DRAWING: '🍬', // Candy cane during drawing
  BOUNDARY_EMOJI_FILLING: '❄️', // Snowflake during filling
  BOUNDARY_EMOJI_FINAL: '🔔', // Bell in final state
  WINNING_EMOJI: '🎄', // Christmas tree
  
  // Phase delays
  DRAWING_PHASE_DELAY_MS: 500,
  FILLING_PHASE_DELAY_MS: 500,
  INITIAL_ANIMATION_DELAY_MS: 500,
  
  // Animation speeds (frames to skip between drawing cells)
  LINE_DRAW_FRAMES_PER_CELL: 2,
  FILL_FRAMES_PER_CELL: 1,
};

// ============================================================================
// CANVAS STYLING
// ============================================================================

export const CANVAS_STYLE = {
  BORDER_WIDTH: '3px',
  BORDER_COLOR: '#ff6b6b',
  BORDER_RADIUS: '10px',
  BOX_SHADOW: '0 0 20px rgba(255, 107, 107, 0.5)',
  BACKGROUND_COLOR: '#0a1929',
  MARGIN: '20px auto',
};

// ============================================================================
// GRID STYLING
// ============================================================================

export const GRID_STYLE = {
  LINE_COLOR: 'rgba(100, 150, 200, 0.2)',
  LINE_WIDTH: 0.5,
  DASH_PATTERN: [10, 5],
  STROKE_WIDTH: 3,
};
