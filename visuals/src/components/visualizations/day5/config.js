/**
 * Day 5 Visualization Configuration
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
  
  // Audio
  SOUND_NAME_DING: 'ding',
  SOUND_FILE_DING: 'ding.mp3',
  
  // Colors (shared)
  TITLE_COLOR: '#663399',              // Purple title
  TEXT_COLOR: '#666',                  // Gray text
  EGGPLANT_GRADIENT: 'linear-gradient(135deg, #663399 0%, #8B4789 50%, #663399 100%)',
  EGGPLANT_BORDER: '#4a2566',          // Dark purple border
  EGGPLANT_STEM: '#2d5016',            // Green stem
  EGGPLANT_SHADOW: '0 4px 8px rgba(0,0,0,0.3)',
  EGGPLANT_HIGHLIGHT_SHADOW: '0 6px 16px rgba(255, 215, 0, 0.8)',
  
  // Wooden ruler colors
  RULER_GRADIENT: 'linear-gradient(to bottom, #d4a574 0%, #c19a6b 50%, #a67c52 100%)',
  RULER_BORDER: '#8b6f47',
  RULER_TICK_MAJOR: '#2c1810',
  RULER_TICK_MINOR: '#4a3728',
  RULER_LABEL_COLOR: '#2c1810',
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Count how many values fall within the eggplant ranges',
  COUNTER_LABEL: 'Values in Ranges',
  
  // Day/Part numbers
  DAY_NUMBER: 5,
  PART_NUMBER: 1,
  
  // Animation timing (eggplant ruler)
  CHECK_VALUE_DELAY_MS: 1000,      // Delay before checking each value
  EGGPLANT_PULSE_DURATION_MS: 800, // Duration of eggplant pulse animation
  MARKER_REMOVE_DELAY_MS: 1500,    // How long marker stays before removal
  
  // Colors (Part 1 specific)
  MARKER_COLOR: '#ff6b6b',         // Red marker for checking values
  MARKER_FOUND_COLOR: '#51cf66',   // Green marker when value found
  COUNTER_COMPLETE_COLOR: '#51cf66', // Green when complete
  COUNTER_TEXT_COLOR: '#333',      // Dark gray counter text
  
  // Test input ranges
  TEST_RANGES: [
    { lower: 3, upper: 5 },
    { lower: 10, upper: 14 },
    { lower: 16, upper: 20 },
    { lower: 12, upper: 18 },
    { lower: 25, upper: 28 },
    { lower: 24, upper: 30 }
  ],
  
  // Test values to check
  TEST_VALUES: [1, 5, 8, 11, 17, 32],
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Merge overlapping ranges and count total values covered',
  COUNTER_LABEL: 'Total Values',
  
  // Day/Part numbers
  DAY_NUMBER: 5,
  PART_NUMBER: 2,
  
  // Animation timing (merging eggplants)
  INITIAL_SHOW_DELAY_MS: 1500,     // Delay after showing initial ranges
  MERGE_ITERATION_DELAY_MS: 500,   // Delay between merge iterations
  MERGE_HIGHLIGHT_DELAY_MS: 500,   // Delay while highlighting ranges to merge
  MERGE_ANIMATION_DELAY_MS: 800,   // Delay for merge animation
  REMOVE_CONTAINED_DELAY_MS: 500,  // Delay when removing contained ranges
  PHASE_TRANSITION_DELAY_MS: 1000, // Delay between major phases
  COUNT_VALUE_DELAY_MS: 100,       // Delay between counting each value
  COUNT_COMPLETE_DELAY_MS: 200,    // Delay after counting each range
  MARKER_FADE_DELAY_MS: 300,       // Delay before removing count marker
  MERGED_FADE_IN_DELAY_MS: 100,    // Delay for merged eggplant fade-in
  
  // Colors (Part 2 specific)
  COUNT_MARKER_COLOR: '#51cf66',   // Green marker for counting
  COUNT_HIGHLIGHT_SHADOW: '0 8px 20px rgba(81, 207, 102, 0.8)', // Green highlight during counting
  STATUS_COMPLETE_COLOR: '#27ae60', // Green status text when complete
  
  // Test input ranges (different from Part 1)
  TEST_RANGES: [
    { lower: 3, upper: 5 },
    { lower: 10, upper: 14 },
    { lower: 16, upper: 20 },
    { lower: 12, upper: 18 }
  ],
};
