import { EggplantRuler } from './eggplant-ruler.js';
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 5 Part 1 visualization
 * Test input from day5-1/input-test.txt
 */
export default function visualize(container, onComplete) {
  const instructionText = 'Count how many values fall within the eggplant ranges';
  const counterLabel = 'Values in Ranges';
  
  // Test input data
  const ranges = [
    { lower: 3, upper: 5 },
    { lower: 10, upper: 14 },
    { lower: 16, upper: 20 },
    { lower: 12, upper: 18 },
    { lower: 25, upper: 28 },
    { lower: 24, upper: 30 }
  ];
  
  const values = [1, 5, 8, 11, 17, 32];
  
  const dayTitle = new DayTitle(container, 5, 1);
  const counterBox = new CounterBox(container, counterLabel);
  const instructionPanel = new InstructionPanel(container, instructionText);
  const ruler = new EggplantRuler(container, ranges, values, counterBox);
  let fireworks = null;
  
  // Load ding sound
  audioManager.loadSound('ding', 'ding.mp3');
  
  // Start checking values
  setTimeout(async () => {
    await ruler.checkAllValues();
    
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
    ruler,
    cleanup: () => {
      dayTitle.cleanup();
      counterBox.cleanup();
      instructionPanel.cleanup();
      ruler.cleanup();
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
