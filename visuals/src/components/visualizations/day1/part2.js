import { Safe } from './safe.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 1 Part 2 visualization
 * Test input from day1-1/input-test.txt
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const directions = COMMON_CONFIG.TEST_DIRECTIONS;
  
  const dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  const safe = new Safe(container, instructionText, directions);
  let fireworks = null;
  
  // Parse and execute directions
  let delay = COMMON_CONFIG.INITIAL_DELAY_MS;
  const moveDuration = COMMON_CONFIG.MOVE_DURATION_MS;
  const pauseBetween = COMMON_CONFIG.PAUSE_BETWEEN_MS;
  
  // Schedule the rotations
  directions.forEach((dir, index) => {
    const direction = dir[0]; // 'L' or 'R'
    const clicks = parseInt(dir.slice(1));
    
    setTimeout(() => {
      // Highlight current line in notepad
      safe.highlightDirection(index);
      
      safe.rotateBy(
        clicks,
        direction,
        moveDuration, 
        (finalPosition) => {
          // Check if this is the last rotation
          if (index === directions.length - 1) {
            // Visualization complete! Celebrate!
            setTimeout(() => {
              safe.markComplete();
              fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
              
              // Notify that visualization is complete
              if (onComplete) {
                onComplete();
              }
            }, COMMON_CONFIG.COMPLETION_DELAY_MS);
          }
        },
        (count) => {
          // Part 2 logic: increment counter and play sound each time we pass through zero
          // This is called during animation when zero is actually crossed
          for (let i = 0; i < count; i++) {
            safe.incrementCounter();
          }
          audioManager.play('zero-hit', COMMON_CONFIG.ZERO_HIT_VOLUME);
        }
      );
    }, delay + index * (moveDuration + pauseBetween));
  });
  
  return {
    safe,
    cleanup: () => {
      dayTitle.cleanup();
      safe.cleanup();
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
