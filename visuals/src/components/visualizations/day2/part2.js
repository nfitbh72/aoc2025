import { ProgressBars } from './bars.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 2 Part 2 visualization
 */
export default function visualize(container, onComplete) {
  const ranges = COMMON_CONFIG.TEST_RANGES;
  const specialNumbers = PART2_CONFIG.SPECIAL_NUMBERS;
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  
  const dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  let fireworks = null;
  
  // Callback when all bars complete
  const onBarsComplete = () => {
    // Visualization complete! Celebrate!
    setTimeout(() => {
      fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
      
      // Notify completion
      if (onComplete) {
        onComplete();
      }
    }, COMMON_CONFIG.COMPLETION_DELAY_MS);
  };
  
  const bars = new ProgressBars(container, COMMON_CONFIG.TOTAL_BARS, ranges, specialNumbers, onBarsComplete, instructionText, COMMON_CONFIG.COUNTER_LABEL);
  
  // Start the bar sequence
  setTimeout(() => {
    bars.start();
  }, COMMON_CONFIG.START_DELAY_MS);
  
  return {
    bars,
    cleanup: () => {
      dayTitle.cleanup();
      bars.cleanup();
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
