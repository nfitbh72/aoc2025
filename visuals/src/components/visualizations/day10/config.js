/**
 * Day 10 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION (shared between Part 1 and Part 2)
// ============================================================================

export const COMMON_CONFIG = {
  // Background and atmosphere
  BACKGROUND_GRADIENT: 'radial-gradient(circle at 50% 50%, #0a1929 0%, #020814 100%)',

  // Snow animation
  SNOWFLAKE_COUNT: 80,
  SNOWFLAKE_MIN_SIZE: 10,
  SNOWFLAKE_MAX_SIZE: 25,
  SNOWFLAKE_MIN_DURATION: 8,
  SNOWFLAKE_MAX_DURATION: 15,
  SNOWFLAKE_EMOJIS: ['❄️', '⛄', '❅', '✨'],
  SNOWFLAKE_MIN_DELAY: 0,
  SNOWFLAKE_MAX_DELAY: 5,

  // Star animation
  STAR_COUNT: 60,
  STAR_SIZE: 3,
  STAR_COLOR: '#ffd700',
  STAR_MIN_ANIMATION_DURATION: 1,
  STAR_MAX_ANIMATION_DURATION: 3,
  STAR_MAX_ANIMATION_DELAY: 2,
  STAR_MIN_GLOW: 3,
  STAR_MAX_GLOW: 8,

  // Machine display
  MACHINE_CONTAINER_SPACING: 30,
  MACHINE_TOP_OFFSET: 150,
  MACHINE_BACKGROUND: 'rgba(10, 25, 41, 0.8)',
  MACHINE_BORDER: '3px solid rgba(255, 215, 0, 0.5)',
  MACHINE_BORDER_RADIUS: '20px',
  MACHINE_PADDING: '20px',
  MACHINE_BOX_SHADOW: '0 0 30px rgba(255, 215, 0, 0.3)',

  // Light bulb styling
  LIGHT_SIZE: 35,
  LIGHT_SPACING: 8,
  LIGHT_OFF_COLOR: '#333',
  LIGHT_OFF_OPACITY: 0.3,
  LIGHT_ON_COLORS: ['#ff0000', '#00ff00', '#0088ff', '#ffaa00', '#ff00ff', '#00ffff', '#ffd700'],
  LIGHT_GLOW_SIZE: 20,
  LIGHT_PULSE_DURATION: 0.5,

  // Button styling
  BUTTON_WIDTH: 55,
  BUTTON_HEIGHT: 55,
  BUTTON_MARGIN: 4,
  BUTTON_BORDER_RADIUS: '15px',
  BUTTON_COLORS: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'],
  BUTTON_BOX_SHADOW: '0 6px 15px rgba(0,0,0,0.3)',
  BUTTON_ACTIVE_SCALE: 0.9,
  BUTTON_PRESSED_COLOR: '#ffd700',
  BUTTON_TRANSITION: 'all 0.2s ease',

  // Machine title styling
  MACHINE_TITLE_FONT_SIZE: '20px',
  MACHINE_TITLE_COLOR: '#ffd700',
  MACHINE_TITLE_TEXT_SHADOW: '0 0 15px rgba(255, 215, 0, 0.8)',
  MACHINE_TITLE_MARGIN: '10px 0',

  // Presses counter styling
  PRESSES_FONT_SIZE: '16px',
  PRESSES_COLOR: '#4ecdc4',
  PRESSES_TEXT_SHADOW: '0 0 10px rgba(78, 205, 196, 0.6)',
  PRESSES_MARGIN: '10px 0',

  // Animation speed control
  // Set to 1.0 for normal speed, 2.0 for 2x slower, 0.5 for 2x faster
  SPEED_MULTIPLIER: 2.0,

  // Animation timing (will be multiplied by SPEED_MULTIPLIER)
  BUTTON_PRESS_DELAY: 600,
  LIGHT_FLASH_DURATION: 300,
  SOLVE_DELAY_BETWEEN_MACHINES: 1500,

  // Audio
  SOUND_NAME_DING: 'ding',
  SOUND_FILE_DING: 'ding.mp3',
  SOUND_NAME_CLICK: 'click',
  SOUND_FILE_CLICK: 'click.mp3',
  SOUND_NAME_ENERGY: 'energy',
  SOUND_FILE_ENERGY: 'energy.mp3',
  SOUND_NAME_YAY: 'yay',
  SOUND_FILE_YAY: 'yay.mp3',

  // Audio volumes
  DING_VOLUME: 0.4,
  CLICK_VOLUME: 0.3,
  ENERGY_VOLUME: 0.5,
  YAY_VOLUME: 0.8,

  // Timing
  START_DELAY_MS: 1000,
  COMPLETION_CHECK_DELAY_MS: 1000,
  COMPLETION_CALLBACK_DELAY_MS: 3000,
  CELEBRATION_SOUND_DELAY_MS: 500,
  FIREWORKS_DURATION_MS: 5000,

  // Test input data
  TEST_INPUT: [
    '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}',
    '[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}',
    '[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}'
  ],
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎄 Press festive buttons to light up the Christmas display! Find the minimum presses! 🎄',
  COUNTER_LABEL: 'Total Button Presses',

  // Day/Part numbers
  DAY_NUMBER: 10,
  PART_NUMBER: 1,

  // Expected answer for test input
  EXPECTED_ANSWER: 7,

  // Celebration messages
  CELEBRATION_MESSAGES: [
    '🎉 Perfect Solution! 🎉',
    '✨ All Lights Shining! ✨',
    '🎄 Merry Christmas! 🎄'
  ],
  MESSAGE_TOP_START: 25,
  MESSAGE_TOP_SPACING: 8,
  MESSAGE_FONT_SIZE: '32px',
  MESSAGE_STAGGER_DELAY_MS: 300,
  MESSAGE_SHOW_DELAY_MS: 500,
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '⚡ Match the joltage requirements with festive button presses! ⚡',
  COUNTER_LABEL: 'Total Button Presses',

  // Day/Part numbers
  DAY_NUMBER: 10,
  PART_NUMBER: 2,

  // Expected answer for test input
  EXPECTED_ANSWER: 33,

  // Joltage meter styling
  JOLTAGE_BAR_WIDTH: 40,
  JOLTAGE_BAR_HEIGHT: 120,
  JOLTAGE_BAR_SPACING: 5,
  JOLTAGE_BAR_BACKGROUND: 'rgba(30, 30, 30, 0.8)',
  JOLTAGE_BAR_BORDER: '2px solid rgba(255, 255, 255, 0.3)',
  JOLTAGE_BAR_BORDER_RADIUS: '8px',

  // Joltage fill colors
  JOLTAGE_FILL_UNDER: 'linear-gradient(to top, #4ecdc4, #45b7d1)',
  JOLTAGE_FILL_MATCH: 'linear-gradient(to top, #00ff00, #7fff00)',
  JOLTAGE_FILL_OVER: 'linear-gradient(to top, #ff0000, #ff6b6b)',

  // Joltage text styling
  JOLTAGE_LABEL_FONT_SIZE: '11px',
  JOLTAGE_LABEL_COLOR: '#ffffff',
  JOLTAGE_VALUE_FONT_SIZE: '14px',
  JOLTAGE_VALUE_COLOR: '#ffaa00',
  JOLTAGE_TARGET_FONT_SIZE: '12px',
  JOLTAGE_TARGET_COLOR: '#00ff00',

  // Joltage glow effects
  JOLTAGE_MATCH_GLOW: '0 0 20px rgba(0, 255, 0, 0.8)',
  JOLTAGE_OVER_GLOW: '0 0 20px rgba(255, 0, 0, 0.8)',

  // Animation
  JOLTAGE_FILL_TRANSITION: 0.3,
  JOLTAGE_PULSE_DURATION: 0.5,

  // Solving animation
  MAX_BUTTON_PRESSES_TO_SHOW: 50, // Limit animation for very long solutions

  // Celebration messages
  CELEBRATION_MESSAGES: [
    '⚡ Perfect Joltage! ⚡',
    '✨ Power Levels Optimal! ✨',
    '🎄 Ho Ho Ho! 🎄'
  ],
  MESSAGE_TOP_START: 25,
  MESSAGE_TOP_SPACING: 8,
  MESSAGE_FONT_SIZE: '32px',
  MESSAGE_STAGGER_DELAY_MS: 300,
  MESSAGE_SHOW_DELAY_MS: 500,
};
