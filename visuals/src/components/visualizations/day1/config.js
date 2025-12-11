/**
 * Day 1 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Animation timing
  INITIAL_DELAY_MS: 500,
  MOVE_DURATION_MS: 800,
  PAUSE_BETWEEN_MS: 200,
  COMPLETION_DELAY_MS: 500,
  FIREWORKS_DURATION_MS: 5000,
  
  // Test input directions (shared between parts)
  TEST_DIRECTIONS: [
    'L68',
    'L30',
    'R48',
    'L5',
    'R60',
    'L55',
    'L1',
    'L99',
    'R14',
    'L82'
  ],
  
  // Audio
  ZERO_HIT_VOLUME: 0.6,
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'The password is the number of times that the dial ends on zero',
  
  // Day/Part numbers
  DAY_NUMBER: 1,
  PART_NUMBER: 1,
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'The password is the number of times that the dial passes through zero',
  
  // Day/Part numbers
  DAY_NUMBER: 1,
  PART_NUMBER: 2,
};
