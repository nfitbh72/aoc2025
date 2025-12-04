import { ProgressBars } from './bars.js';
import { celebrate } from '../../../utils/celebration.js';

/**
 * Day 2 Part 2 visualization
 */
export default function visualize(container, onComplete) {
  // Parse ranges from input
  const ranges = [
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
  ];
  
  // Special numbers to highlight for Part 2
  const specialNumbers = [11, 22, 99, 111, 999, 1010, 1188511885, 222222, 446446, 38593859, 565656, 824824824, 2121212121];
  
  // Instruction text for Part 2
  const instructionText = 'Find IDs that are made only of some sequence of digits repeated at least twice';
  
  let fireworks = null;
  
  // Callback when all bars complete
  const onBarsComplete = () => {
    // Visualization complete! Celebrate!
    setTimeout(() => {
      fireworks = celebrate(container, 5000);
      
      // Notify completion
      if (onComplete) {
        onComplete();
      }
    }, 500);
  };
  
  const bars = new ProgressBars(container, 11, ranges, specialNumbers, onBarsComplete, instructionText);
  
  // Start the bar sequence
  setTimeout(() => {
    bars.start();
  }, 1000);
  
  return {
    bars,
    cleanup: () => {
      bars.cleanup();
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
