import { EggplantRuler } from './eggplant-ruler.js';
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';

/**
 * Day 5 Part 1 visualization
 * Test input from day5-1/input-test.txt
 */
export default function visualize(container, onComplete) {
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = PART1_CONFIG.COUNTER_LABEL;
  const ranges = PART1_CONFIG.TEST_RANGES;
  const values = PART1_CONFIG.TEST_VALUES;
  
  const dayTitle = new DayTitle(container, PART1_CONFIG.DAY_NUMBER, PART1_CONFIG.PART_NUMBER);
  const counterBox = new CounterBox(container, counterLabel);
  const instructionPanel = new InstructionPanel(container, instructionText);
  const ruler = new EggplantRuler(container, ranges, values, counterBox);
  let fireworks = null;
  
  // Load ding sound
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  
  // Start checking values
  setTimeout(async () => {
    await ruler.checkAllValues();
    
    // Mark complete and celebrate
    setTimeout(() => {
      counterBox.markComplete();
      fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
      
      if (onComplete) {
        onComplete();
      }
    }, COMMON_CONFIG.COMPLETION_DELAY_MS);
  }, COMMON_CONFIG.START_DELAY_MS);
  
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
