/**
 * Day 8 Visualization Configuration
 * Centralized configuration for all hardcoded values
 */

// ============================================================================
// COMMON CONFIGURATION
// ============================================================================

export const COMMON_CONFIG = {
  // 3D Space dimensions
  SPACE_WIDTH: 600,
  SPACE_HEIGHT: 600,
  PERSPECTIVE: 1200,
  
  // 3D Scene animation
  ROTATION_DURATION_S: 30,           // Duration of full 360° rotation
  ROTATION_X_DEG: 20,                // X-axis tilt angle
  
  // Normalization
  NORMALIZE_MAX_VAL: 1000,           // Maximum coordinate value
  NORMALIZE_SCALE: 500,              // Scale factor for display
  
  // Ornament styling
  ORNAMENT_SIZE: 30,                 // Default ornament size in pixels
  ORNAMENT_EMOJI: '🎄',              // Default ornament emoji
  ORNAMENT_COLORS: ['#ff0000', '#00ff00', '#0088ff', '#ffaa00', '#ff00ff', '#00ffff'],
  ORNAMENT_ANIMATION_DELAY_S: 0.1,   // Delay multiplier per ornament
  ORNAMENT_GLOW_DURATION_S: 2,       // Glow animation duration
  ORNAMENT_HOVER_SCALE: 1.5,         // Scale on hover
  ORNAMENT_TRANSITION_DURATION_S: 0.3, // Transition duration
  
  // Connection (light string) styling
  CONNECTION_WIDTH: 3,               // Default connection line width
  CONNECTION_COLORS: ['#ffff00', '#ff00ff', '#00ffff', '#ff8800'],
  CONNECTION_OPACITY: 0.8,           // Normal connection opacity
  CONNECTION_FADE_IN_DURATION_MS: 50, // Fade in delay
  CONNECTION_FADE_IN_TRANSITION_S: 0.5, // Fade in transition duration
  CONNECTION_PULSE_DURATION_S: 1.5,  // Light pulse animation duration
  CONNECTION_ANIMATION_DELAY_S: 0.1, // Delay multiplier per connection
  CONNECTION_GLOW_SMALL: 10,         // Small glow size
  CONNECTION_GLOW_LARGE: 20,         // Large glow size
  
  // Special (golden) styling
  SPECIAL_COLOR: 'gold',
  SPECIAL_CONNECTION_WIDTH_MULTIPLIER: 2,
  SPECIAL_CONNECTION_OPACITY: 1,
  SPECIAL_GLOW_SMALL: 20,
  SPECIAL_GLOW_LARGE: 40,
  SPECIAL_GLOW_EXTRA: 60,
  SPECIAL_BRIGHTNESS: 1.5,
  SPECIAL_BRIGHTNESS_PEAK: 2,
  SPECIAL_SCALE: 1.3,
  SPECIAL_Z_INDEX: 100,
  
  // Sparkle styling
  SPARKLE_EMOJI: '✨',
  SPARKLE_SIZE: 20,
  SPARKLE_DURATION_MS: 1000,
  SPARKLE_SCALE_MAX: 1.2,
  SPARKLE_ROTATION_DEG: 180,
  
  // Animation keyframes brightness/scale
  GLOW_BRIGHTNESS_MIN: 1,
  GLOW_BRIGHTNESS_MAX: 1.5,
  GLOW_DROP_SHADOW_SMALL: 5,
  GLOW_DROP_SHADOW_LARGE: 15,
  
  // Test input data (shared between parts)
  TEST_BOXES: [
    [162,817,812], [57,618,57], [906,360,560], [592,479,940],
    [352,342,300], [466,668,158], [542,29,236], [431,825,988],
    [739,650,466], [52,470,668], [216,146,977], [819,987,18],
    [117,168,530], [805,96,715], [346,949,466], [970,615,88],
    [941,993,340], [862,61,35], [984,92,344], [425,690,689]
  ],
  
  // Audio
  SOUND_NAME_DING: 'ding',
  SOUND_FILE_DING: 'ding.mp3',
  SOUND_NAME_ENERGY: 'energy',
  SOUND_FILE_ENERGY: 'energy.mp3',
  SOUND_NAME_YAY: 'yay',
  SOUND_FILE_YAY: 'yay.mp3',
  SOUND_NAME_EXPLOSION: 'explosion',
  SOUND_FILE_EXPLOSION: 'explosion.mp3',
  
  // Audio volumes
  DING_VOLUME: 0.3,
  ENERGY_VOLUME: 0.4,
  YAY_VOLUME: 0.8,
  
  // Timing
  START_DELAY_MS: 1000,
  COMPLETION_CHECK_DELAY_MS: 1000,
  COMPLETION_CALLBACK_DELAY_MS: 2000,
  CELEBRATION_SOUND_DELAY_MS: 500,
  FIREWORKS_DURATION_MS: 5000,
};

// ============================================================================
// PART 1 CONFIGURATION
// ============================================================================

export const PART1_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '🎄 Connect Christmas ornaments with glowing light strings to form festive circuits! 🎄',
  COUNTER_LABEL: 'Circuit Score',
  
  // Day/Part numbers
  DAY_NUMBER: 8,
  PART_NUMBER: 1,
  
  // Animation timing
  ORNAMENT_CREATE_DELAY_MS: 100,     // Delay between creating each ornament
  CONNECTION_CREATE_DELAY_MS: 400,   // Delay between creating each connection
  ORNAMENT_WAIT_EXTRA_MS: 500,       // Extra wait after all ornaments created
  SCORE_CALCULATION_DELAY_MS: 500,   // Delay before showing final score
  
  // Connection pairs for Part 1
  CONNECTION_PAIRS: [
    [0, 19], [0, 7], [2, 14], [4, 9], [3, 16], [5, 11],
    [8, 2], [0, 14], [2, 16], [1, 6]
  ],
  
  // Expected answer
  EXPECTED_ANSWER: 40,
  
  // Options for ornament creation
  ORNAMENT_OPTIONS: {
    playSound: true,
    sparkles: true
  },
};

// ============================================================================
// PART 2 CONFIGURATION
// ============================================================================

export const PART2_CONFIG = {
  // UI Text
  INSTRUCTION_TEXT: '⭐ Find the GOLDEN connection that unites all ornaments into one magical circuit! ⭐',
  COUNTER_LABEL: 'Connections',
  
  // Day/Part numbers
  DAY_NUMBER: 8,
  PART_NUMBER: 2,
  
  // Animation timing
  INITIAL_WAIT_MS: 500,              // Wait after creating all ornaments
  REGULAR_CONNECTION_DELAY_MS: 150,  // Delay between regular connections
  GOLDEN_PAUSE_MS: 1000,             // Dramatic pause before golden connection
  GOLDEN_HIGHLIGHT_DURATION_MS: 1500, // Duration of golden ornament highlight
  GOLDEN_SPARKLE_DELAY_MS: 200,      // Delay between sparkle bursts
  GOLDEN_SPARKLE_COUNT: 5,           // Number of sparkle bursts per ornament
  GOLDEN_CONNECTION_WAIT_MS: 1500,   // Wait after creating golden connection
  EXPLOSION_SPARKLE_COUNT: 20,       // Number of sparkles in explosion
  EXPLOSION_SPARKLE_DELAY_MS: 50,    // Delay between explosion sparkles
  EXPLOSION_OFFSET_RANGE: 100,       // Random offset range for explosion sparkles
  
  // Audio
  DING_SOUND_FREQUENCY: 3,           // Play ding every N connections
  DING_VOLUME_SUBTLE: 0.2,           // Volume for regular connection dings
  ENERGY_VOLUME_GOLDEN: 0.6,         // Volume for golden ornament energy
  EXPLOSION_VOLUME: 0.7,             // Volume for golden connection explosion
  
  // Regular connections (before golden)
  REGULAR_CONNECTIONS: [
    [0, 19], [0, 7], [2, 14], [0, 7], [4, 16], [9, 12],
    [11, 17], [8, 2], [14, 0], [2, 16], [1, 6], [5, 11],
    [13, 2], [15, 18], [3, 9], [7, 0], [10, 12], [14, 8],
    [16, 13], [6, 7], [18, 17], [19, 7], [12, 13], [17, 18],
    [11, 5], [16, 2], [9, 3], [13, 16]
  ],
  
  // The golden connection (29th iteration)
  GOLDEN_CONNECTION: [10, 12],
  
  // Golden ornament styling
  GOLDEN_EMOJI: '⭐',
  GOLDEN_ANIMATION: 'specialGlow 1s ease-in-out infinite',
  
  // Expected answer
  EXPECTED_ANSWER: 25272,            // 216 * 117 = 25272
  
  // Options for ornament creation (faster than Part 1)
  ORNAMENT_OPTIONS: {
    emoji: '🎄',
    interactive: true
  },
};
