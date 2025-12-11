/**
 * Day 3 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Animation timing
  START_DELAY_MS: 500,
  COMPLETION_DELAY_MS: 500,
  FIREWORKS_DURATION_MS: 5000,
  BATTERY_TRANSITION_DELAY_MS: 500,
  
  // Test input (shared between parts)
  TEST_BATTERY_NUMBERS: [
    '987654321111111',
    '811111111111119',
    '234234234234278',
    '818181911112111'
  ],
  
  // Colors (Christmas colors: red and green alternating)
  BATTERY_COLORS: ['#c41e3a', '#0f8a5f', '#c41e3a', '#0f8a5f'],
  
  // UI
  COUNTER_LABEL: 'Total Joltage',
  
  // Battery container styling
  BATTERY_CONTAINER_MAX_WIDTH: 1000,
  BATTERY_GAP: 15,
  BATTERY_CONTAINER_TOP: '50%',
  BATTERY_CONTAINER_LEFT: '50%',
  
  // Audio
  SOUND_FILE_DING: 'ding.mp3',
  SOUND_FILE_EXPLOSION: 'explosion.mp3',
  SOUND_FILE_CLICK: 'click.mp3',
  DING_VOLUME: 0.5,
  BATTERY_COMPLETE_VOLUME: 0.6,
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Find the largest 2-digit number from each line by combining digits in order, then sum them all.',
  
  // Day/Part numbers
  DAY_NUMBER: 3,
  PART_NUMBER: 1,
  
  // Animation timing
  DELAY_PER_PAIR_MS: 100, // ms between each pair highlight
  BATTERY_COMPLETE_DELAY_MS: 300,
  
  // Audio
  SOUND_NAME_MAX_UPDATE: 'max-update',
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Find the largest 12-digit number from each line by combining digits in order, then sum them all.',
  
  // Day/Part numbers
  DAY_NUMBER: 3,
  PART_NUMBER: 2,
  
  // Algorithm settings
  RESULT_DIGIT_LENGTH: 12,
  
  // Animation timing
  DELAY_PER_STEP_MS: 100, // ms between each step
  
  // Battery container positioning (slightly left for stack display)
  BATTERY_CONTAINER_LEFT: '45%',
  
  // Audio
  SOUND_NAME_BATTERY_COMPLETE: 'battery-complete',
  SOUND_NAME_DIGIT_EXPLODE: 'digit-explode',
  SOUND_NAME_DIGIT_ADD: 'digit-add',
  
  // Battery styling
  BATTERY_WIDTH: 400,
  BATTERY_HEIGHT: 80,
  BATTERY_BORDER_WIDTH: 4,
  BATTERY_BORDER_RADIUS: 12,
  BATTERY_PADDING: 20,
  
  // Drop counter styling
  DROP_COUNTER_MIN_WIDTH: 60,
  DROP_LABEL_FONT_SIZE: 12,
  DROP_VALUE_FONT_SIZE: 24,
  DROP_VALUE_COLOR: '#ffd700',
};
