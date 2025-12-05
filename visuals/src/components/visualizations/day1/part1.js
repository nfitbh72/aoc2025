import { Safe } from './safe.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 1 Part 1 visualization
 * Test input from day1-1/input-test.txt
 */
export default function visualize(container, onComplete) {
  const instructionText = 'The password is the number of times that the dial ends on zero';
  
  // Test input directions
  const directions = [
    'L68',
    'L30',
    'R48',
    'L5',
    'R60',
    'L55',
    'L1',
    'L99',
    'R14',
    'L82'
  ];
  
  const dayTitle = new DayTitle(container, 1, 1);
  const safe = new Safe(container, instructionText, directions);
  let fireworks = null;
  
  // Parse and execute directions
  let delay = 500; // Initial delay
  const moveDuration = 800; // Duration for each move
  const pauseBetween = 200; // Pause between moves
  
  // Schedule the rotations
  directions.forEach((dir, index) => {
    const direction = dir[0]; // 'L' or 'R'
    const clicks = parseInt(dir.slice(1));
    
    setTimeout(() => {
      // Highlight current line in notepad
      safe.highlightDirection(index);
      
      safe.rotateBy(clicks, direction, moveDuration, (finalPosition) => {
        // Part 1 logic: increment counter when dial lands on zero
        if (finalPosition === 0) {
          safe.incrementCounter();
          audioManager.play('zero-hit', 0.6);
        }
        
        // Check if this is the last rotation
        if (index === directions.length - 1) {
          // Visualization complete! Celebrate!
          setTimeout(() => {
            safe.markComplete();
            fireworks = celebrate(container, 5000);
            
            // Notify that visualization is complete
            if (onComplete) {
              onComplete();
            }
          }, 500);
        }
      });
    }, delay + index * (moveDuration + pauseBetween));
  });
  
  return {
    dayTitle,
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
