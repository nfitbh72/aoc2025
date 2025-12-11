/**
 * Day 4 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Animation timing
  START_DELAY_MS: 1000,
  SANTA_MOVE_DELAY_MS: 300,
  TREE_THROW_DELAY_MS: 1400,
  COMPLETION_DELAY_MS: 500,
  FIREWORKS_DURATION_MS: 5000,
  
  // Test input grid (shared between parts)
  TEST_GRID_DATA: [
    '..@@.@@@@.',
    '@@@.@.@.@@',
    '@@@@@.@.@@',
    '@.@@@@..@.',
    '@@.@@@@.@@',
    '.@@@@@@@.@',
    '.@.@.@.@@@',
    '@.@@@.@@@@',
    '.@@@@@@@@.',
    '@.@.@@@.@.'
  ],
  
  // UI
  COUNTER_LABEL: 'Trees Collected',
  
  // Grid symbols
  TREE_SYMBOL: '@',
  EMPTY_SYMBOL: '.',
  EMPTY_DISPLAY: '·',
  
  // Tree criteria
  MAX_ADJACENT_TREES: 4, // Trees with < 4 adjacent trees are accessible
  
  // Santa starting position
  SANTA_START_X: -1,
  SANTA_START_Y: 0,
  
  // Accessible tree styling
  ACCESSIBLE_TREE_BOX_SHADOW: '0 0 20px rgba(255, 215, 0, 1), 0 0 35px rgba(255, 50, 50, 0.8)',
  ACCESSIBLE_TREE_SCALE: 1.15,
  ACCESSIBLE_TREE_BRIGHTNESS: 1.3,
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎅 Santa collects trees that have fewer than 4 neighboring trees!',
  
  // Day/Part numbers
  DAY_NUMBER: 4,
  PART_NUMBER: 1,
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎅 Santa collects accessible trees in rounds until none remain!',
  
  // Day/Part numbers
  DAY_NUMBER: 4,
  PART_NUMBER: 2,
  
  // Animation timing
  ROUND_START_DELAY_MS: 500,
  ROUND_COMPLETE_DELAY_MS: 800,
  TREE_COLLECT_DELAY_MS: 250,
  
  // Round label styling
  ROUND_LABEL_TOP: '80px',
  ROUND_LABEL_FONT_SIZE: '32px',
  ROUND_LABEL_COLOR: '#ffd700',
  ROUND_LABEL_TEXT_SHADOW: '0 0 10px rgba(255, 215, 0, 0.5)',
  
  // Round label text
  ROUND_LABEL_PREFIX: 'Round',
  ROUND_COMPLETE_TEXT: 'Complete!',
  ROUND_COMPLETE_SUFFIX: 'rounds',
  
  // Highlighted tree styling (less intense than Part 1)
  HIGHLIGHTED_TREE_BOX_SHADOW: '0 0 10px rgba(255, 215, 0, 0.8)',
};
