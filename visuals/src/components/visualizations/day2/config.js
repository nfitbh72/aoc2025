/**
 * Day 2 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Animation timing
  START_DELAY_MS: 1000,
  COMPLETION_DELAY_MS: 500,
  FIREWORKS_DURATION_MS: 5000,
  
  // Test input ranges (shared between parts)
  TEST_RANGES: [
    { start: 11, end: 22 },
    { start: 95, end: 115 },
    { start: 998, end: 1012 },
    { start: 1188511880, end: 1188511890 },
    { start: 222220, end: 222224 },
    { start: 1698522, end: 1698528 },
    { start: 446443, end: 446449 },
    { start: 38593856, end: 38593862 },
    { start: 565653, end: 565659 },
    { start: 824824821, end: 824824827 },
    { start: 2121212118, end: 2121212124 }
  ],
  
  // UI
  TOTAL_BARS: 11,
  COUNTER_LABEL: 'Invalid Product IDs',
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Find IDs which are made only of a sequence of digits repeated twice',
  
  // Day/Part numbers
  DAY_NUMBER: 2,
  PART_NUMBER: 1,
  
  // Special numbers to highlight (repeated exactly twice)
  SPECIAL_NUMBERS: [11, 22, 99, 1010, 1188511885, 222222, 446446, 38593859],
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Find IDs that are made only of some sequence of digits repeated at least twice',
  
  // Day/Part numbers
  DAY_NUMBER: 2,
  PART_NUMBER: 2,
  
  // Special numbers to highlight (repeated at least twice)
  SPECIAL_NUMBERS: [11, 22, 99, 111, 999, 1010, 1188511885, 222222, 446446, 38593859, 565656, 824824824, 2121212121],
};
