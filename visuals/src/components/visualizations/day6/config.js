/**
 * Day 6 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Animation timing
  GRID_LINE_DELAY_MS: 150,         // Delay between each grid line appearing
  INITIAL_DELAY_MS: 1500,          // Delay before starting calculations
  COLUMN_DELAY_MS: 300,            // Delay between column calculations
  COUNTER_ANIMATE_DURATION_MS: 500, // Duration for counter animation
  COMPLETION_DELAY_MS: 500,        // Delay before completion
  FIREWORKS_DURATION_MS: 5000,     // Fireworks duration
  
  // Layout
  COLUMN_WIDTH: 150,               // Width of each calculator column
  COLUMN_SPACING: 200,             // Spacing between columns
  COLUMN_START_Y: 280,             // Y position for columns (Part 1)
  
  // Grid display styling
  GRID_TOP: '120px',
  GRID_BACKGROUND: 'rgba(20, 20, 40, 0.8)',
  GRID_BORDER: '2px solid rgba(255, 255, 255, 0.3)',
  GRID_BORDER_RADIUS: '15px',
  GRID_PADDING: '20px',
  GRID_GAP: '5px',
  GRID_FONT_SIZE: '18px',
  GRID_COLOR: '#94a3b8',
  
  // Test input grid lines (shared)
  TEST_GRID_LINES: [
    '123 328  51 64 ',
    ' 45 64  387 23 ',
    '  6 98  215 314',
    '*   +   *   +  '
  ],
  
  // Audio
  SOUND_NAME_DING: 'ding',
  SOUND_FILE_DING: 'ding.mp3',
  
  // UI
  COUNTER_LABEL: 'Total Sum',
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎄 Calculate each column using the operator at the bottom!',
  
  // Day/Part numbers
  DAY_NUMBER: 6,
  PART_NUMBER: 1,
  
  // Test input columns (reading top to bottom)
  TEST_COLUMNS: [
    { numbers: [123, 45, 6], operator: 2 },    // * (multiply)
    { numbers: [328, 64, 98], operator: 0 },   // + (add)
    { numbers: [51, 387, 215], operator: 2 },  // * (multiply)
    { numbers: [64, 23, 314], operator: 0 }    // + (add)
  ],
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎁 Now read the numbers VERTICALLY and calculate!',
  
  // Day/Part numbers
  DAY_NUMBER: 6,
  PART_NUMBER: 2,
  
  // Animation timing (Part 2 specific)
  TRANSFORMATION_DELAY_MS: 1000,   // Delay before showing transformation
  TRANSFORMATION_SHOW_MS: 2000,    // How long to show transformation
  
  // Layout (Part 2 specific)
  COLUMN_START_Y: 320,             // Y position for columns (Part 2, lower)
  ORIGINAL_GRID_LEFT: '30%',       // Position of original grid
  TRANSFORMED_GRID_LEFT: '52%',    // Position of transformed grid
  TRANSFORMED_GRID_TOP: '100px',
  
  // Transformed grid styling
  TRANSFORMED_BACKGROUND: 'rgba(30, 50, 70, 0.9)',
  TRANSFORMED_BORDER: '2px solid rgba(100, 200, 255, 0.5)',
  TRANSFORMED_BORDER_RADIUS: '15px',
  TRANSFORMED_PADDING: '15px 20px',
  TRANSFORMED_FONT_SIZE: '15px',
  TRANSFORMED_COLOR: '#94a3b8',
  TRANSFORMED_TITLE_COLOR: '#60a5fa',
  TRANSFORMED_TITLE_SIZE: '14px',
  
  // Test input fields (reading vertically)
  TEST_FIELDS: [
    { numbers: [356, 24, 1], operator: 2 },      // * (multiply) = 8544
    { numbers: [8, 248, 369], operator: 0 },     // + (add) = 625
    { numbers: [175, 581, 32], operator: 2 },    // * (multiply) = 3253600
    { numbers: [4, 431, 623], operator: 0 }      // + (add) = 1058
  ],
  
  // Vertical reading interpretation lines
  VERTICAL_LINES: [
    'Field 1: 3→5→6, 2→4, 1  (×) = 8,544',
    'Field 2: 8, 2→4→8, 3→6→9  (+) = 625',
    'Field 3: 1→7→5, 5→8→1, 3→2  (×) = 3,253,600',
    'Field 4: 4, 4→3→1, 6→2→3  (+) = 1,058'
  ],
};
