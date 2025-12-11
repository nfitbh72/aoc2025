import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { 
  create3DSpace, 
  addOrnamentStyles, 
  createOrnaments, 
  createConnections 
} from './ornament-3d.js';
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';

/**
 * Day 8 Part 1 - Christmas Ornament Circuit Visualization
 * Visualizes junction boxes as 3D Christmas ornaments connecting via glowing light strings
 */
export default function visualize(container, onComplete) {
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = PART1_CONFIG.COUNTER_LABEL;
  const boxes = COMMON_CONFIG.TEST_BOXES;
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  const timers = [];
  
  // Create components
  dayTitle = new DayTitle(container, PART1_CONFIG.DAY_NUMBER, PART1_CONFIG.PART_NUMBER);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create 3D space and styles
  const { space3D, scene } = create3DSpace(container);
  const style = addOrnamentStyles();
  
  // Load audio files
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_ENERGY, COMMON_CONFIG.SOUND_FILE_ENERGY);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.SOUND_FILE_YAY);
  
  // Animation sequence
  async function animate() {
    // Create all ornaments
    const ornaments = await createOrnaments(scene, boxes, timers, {
      delay: PART1_CONFIG.ORNAMENT_CREATE_DELAY_MS,
      ...PART1_CONFIG.ORNAMENT_OPTIONS
    });
    
    // Connect ornaments to form circuits (simulating the algorithm)
    const connectionPairs = PART1_CONFIG.CONNECTION_PAIRS;
    
    // Keep counter at 0 during connections
    await createConnections(scene, ornaments, connectionPairs, timers, {
      delay: PART1_CONFIG.CONNECTION_CREATE_DELAY_MS
    });
    
    // Final score calculation (3 longest circuits multiplied: 5 * 4 * 2 = 40)
    await new Promise(resolve => timers.push(setTimeout(resolve, PART1_CONFIG.SCORE_CALCULATION_DELAY_MS)));
    counterBox.setValue(PART1_CONFIG.EXPECTED_ANSWER);
    
    // Check if correct and celebrate
    timers.push(setTimeout(() => {
      const expectedAnswer = PART1_CONFIG.EXPECTED_ANSWER;
      const isCorrect = counterBox.counterValue === expectedAnswer;
      
      if (isCorrect) {
        counterBox.markComplete();
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
        
        setTimeout(() => {
          audioManager.play(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.YAY_VOLUME);
        }, COMMON_CONFIG.CELEBRATION_SOUND_DELAY_MS);
      }
      
      if (onComplete) {
        setTimeout(onComplete, COMMON_CONFIG.COMPLETION_CALLBACK_DELAY_MS);
      }
    }, COMMON_CONFIG.COMPLETION_CHECK_DELAY_MS));
  }
  
  // Start animation
  timers.push(setTimeout(() => {
    animate();
  }, COMMON_CONFIG.START_DELAY_MS));
  
  return {
    cleanup: () => {
      // Clear all timers
      timers.forEach(timer => clearTimeout(timer));
      
      // Remove style
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
      
      // Remove 3D space
      if (space3D && space3D.parentNode) {
        space3D.parentNode.removeChild(space3D);
      }
      
      // Cleanup components
      if (dayTitle) dayTitle.cleanup();
      if (counterBox) counterBox.cleanup();
      if (instructionPanel) instructionPanel.cleanup();
      if (fireworks) fireworks.cleanup();
    }
  };
}
