/**
 * Day 7 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // Animation timing
  BEAM_START_DELAY_MS: 1000,           // Delay before starting beam animation
  BEAM_CHECK_DELAY_MS: 150,            // Delay between beam position checks
  SPLIT_BEAM_DELAY_MS: 100,            // Delay before spawning split beams
  ANIMATION_COMPLETE_WAIT_MS: 3000,    // Wait for animations to complete
  MESSAGE_SHOW_DELAY_MS: 2000,         // Delay before showing completion messages
  MESSAGE_STAGGER_DELAY_MS: 500,       // Delay between each message
  COMPLETION_CALLBACK_DELAY_MS: 4000,  // Delay before calling onComplete
  FIREWORKS_DURATION_MS: 8000,         // Fireworks duration
  CELEBRATION_SOUND_DELAY_MS: 500,     // Delay before playing celebration sound
  
  // Beam animation
  BEAM_SPEED: 0.1,                     // Beam movement speed
  BEAM_TRAIL_FADE_RATE: 0.05,          // How fast beam trails fade
  
  // Sparkle animation
  SPARKLE_LIFE_DECAY: 0.02,            // How fast sparkles fade
  SPARKLE_GRAVITY: 0.2,                // Gravity effect on sparkles
  SPARKLE_EMOJIS: ['✨', '⭐', '💫', '🌟'],
  
  // Stars background
  STAR_COUNT: 50,                      // Number of twinkling stars
  STAR_SIZE: 2,                        // Star size in pixels
  STAR_MIN_ANIMATION_DURATION: 2,      // Minimum twinkle duration (seconds)
  STAR_MAX_ANIMATION_DURATION: 5,      // Maximum twinkle duration (seconds)
  STAR_MAX_ANIMATION_DELAY: 2,         // Maximum animation delay (seconds)
  STAR_MIN_GLOW: 2,                    // Minimum glow size
  STAR_MAX_GLOW: 5,                    // Maximum glow size
  
  // Colors
  BACKGROUND_GRADIENT: 'radial-gradient(circle at 50% 50%, #0a0a1e 0%, #000000 100%)',
  STAR_COLOR: 'white',
  BEAM_COLOR: '#00ffff',               // Cyan beam color
  BEAM_HEAD_COLOR: '#ffffff',          // White beam head
  TREE_GRADIENT_START: '#0d5c0d',      // Dark green
  TREE_GRADIENT_MID: '#0f7d0f',        // Medium green
  TREE_GRADIENT_END: '#0a4a0a',        // Darker green
  TREE_SHADOW_COLOR: 'rgba(15, 125, 15, 0.5)',
  TRUNK_GRADIENT_START: '#4a2511',     // Dark brown
  TRUNK_GRADIENT_MID: '#6b3a1e',       // Medium brown
  TRUNK_GRADIENT_END: '#4a2511',       // Dark brown
  STAR_TOP_COLOR: '#ffd700',           // Gold star
  
  // Ornament colors (lit)
  ORNAMENT_COLORS_LIT: ['#ff0000', '#ffd700', '#00ff00', '#ff69b4', '#00ffff'],
  // Ornament colors (unlit)
  ORNAMENT_COLORS_UNLIT: ['#8b0000', '#b8860b', '#006400', '#8b008b', '#008b8b'],
  
  // Present colors
  PRESENT_BOX_COLORS: ['#e74c3c', '#3498db', '#e67e22'],
  PRESENT_RIBBON_COLOR: '#ffffff',
  
  // Completion messages styling
  MESSAGE_FONT_SIZE: '36px',
  MESSAGE_COLOR: '#ffd700',
  MESSAGE_TEXT_SHADOW: '0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.6), 3px 3px 6px rgba(0, 0, 0, 0.8)',
  
  // Test input grid (shared between parts)
  TEST_GRID: [
    '.......S.......'.split(''),
    '...............'.split(''),
    '.......^.......'.split(''),
    '...............'.split(''),
    '......^.^......'.split(''),
    '...............'.split(''),
    '.....^.^.^.....'.split(''),
    '...............'.split(''),
    '....^.^...^....'.split(''),
    '...............'.split(''),
    '...^.^...^.^...'.split(''),
    '...............'.split(''),
    '..^...^.....^..'.split(''),
    '...............'.split(''),
    '.^.^.^.^.^...^.'.split(''),
    '...............'.split('')
  ],
  
  // Audio
  SOUND_NAME_DING: 'ding',
  SOUND_FILE_DING: 'ding.mp3',
  SOUND_NAME_YAY: 'yay',
  DING_VOLUME: 0.4,
  YAY_VOLUME: 0.8,
  
  // Beam starting position
  BEAM_START_X: 7,
  BEAM_START_Y: 0,
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Count unique ornament positions hit by light beams! 🎄✨',
  COUNTER_LABEL: 'Ornaments Lit 🎄',
  
  // Day/Part numbers
  DAY_NUMBER: 7,
  PART_NUMBER: 1,
  
  // Expected answer
  EXPECTED_ANSWER: 21,
  
  // Completion messages
  COMPLETION_MESSAGES: [
    '🎄 Merry Christmas! 🎄',
    '✨ {count} Ornaments Lit! ✨',
    '⭐ Tree Complete! ⭐',
    '🎁 Happy Holidays! 🎁'
  ],
  
  // Message positions (percentage from top)
  MESSAGE_TOP_START: 30,
  MESSAGE_TOP_SPACING: 15,
  
  // Audio volume (Part 1 specific)
  DING_VOLUME: 0.4,
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: 'Count TOTAL beams reaching the bottom! 🎄✨',
  COUNTER_LABEL: 'Total Beams 🌟',
  
  // Day/Part numbers
  DAY_NUMBER: 7,
  PART_NUMBER: 2,
  
  // Expected answer
  EXPECTED_ANSWER: 40,
  
  // Completion messages
  COMPLETION_MESSAGES: [
    '🎄 Merry Christmas! 🎄',
    '🌟 {count} Total Beams! 🌟',
    '⭐ Tree Complete! ⭐',
    '🎁 Happy Holidays! 🎁'
  ],
  
  // Message positions (percentage from top)
  MESSAGE_TOP_START: 30,
  MESSAGE_TOP_SPACING: 15,
  
  // Audio volume (Part 2 specific)
  DING_VOLUME: 0.3,
};
