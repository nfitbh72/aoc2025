import { MergingEggplants } from './merging-eggplants.js';
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 5 Part 2 visualization
 * Test input from day5-2/input-test.txt
 */
export default function visualize(container, onComplete) {
  const instructionText = 'Merge overlapping ranges and count total values covered';
  const counterLabel = 'Total Values';
  
  // Test input data
  const ranges = [
    { lower: 3, upper: 5 },
    { lower: 10, upper: 14 },
    { lower: 16, upper: 20 },
    { lower: 12, upper: 18 }
  ];
  
  const dayTitle = new DayTitle(container, 5, 2);
  const counterBox = new CounterBox(container, counterLabel);
  const instructionPanel = new InstructionPanel(container, instructionText);
  const mergingEggplants = new MergingEggplants(container, ranges, counterBox);
  let fireworks = null;
  
  // Load ding sound
  audioManager.loadSound('ding', 'ding.mp3');
  
  // Start animation
  setTimeout(async () => {
    await mergingEggplants.animate();
    
    // Mark complete and celebrate
    setTimeout(() => {
      counterBox.markComplete();
      fireworks = celebrate(container, 5000);
      
      if (onComplete) {
        onComplete();
      }
    }, 500);
  }, 1000);
  
  return {
    dayTitle,
    counterBox,
    instructionPanel,
    mergingEggplants,
    cleanup: () => {
      dayTitle.cleanup();
      counterBox.cleanup();
      instructionPanel.cleanup();
      mergingEggplants.cleanup();
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
