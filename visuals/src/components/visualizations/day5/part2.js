import { MergingEggplants } from './merging-eggplants.js';
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 5 Part 2 visualization
 * Test input from day5-2/input-test.txt
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = PART2_CONFIG.COUNTER_LABEL;
  const ranges = PART2_CONFIG.TEST_RANGES;
  
  const dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  const counterBox = new CounterBox(container, counterLabel);
  const instructionPanel = new InstructionPanel(container, instructionText);
  const mergingEggplants = new MergingEggplants(container, ranges, counterBox);
  let fireworks = null;
  
  // Load ding sound
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  
  // Start animation
  setTimeout(async () => {
    await mergingEggplants.animate();
    
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
