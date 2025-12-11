import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { 
  create3DSpace, 
  addOrnamentStyles, 
  createOrnament,
  createConnection,
  normalize,
  createSparkle
} from './ornament-3d.js';
import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Day 8 Part 2 - Find the Golden Connection
 * Visualizes finding the specific connection that unites all ornaments into a single circuit
 */
export default function visualize(container, onComplete) {
  const instructionText = PART2_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = PART2_CONFIG.COUNTER_LABEL;
  const boxes = COMMON_CONFIG.TEST_BOXES;
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  const timers = [];
  const ornaments = [];
  const connections = [];
  
  // Create components
  dayTitle = new DayTitle(container, PART2_CONFIG.DAY_NUMBER, PART2_CONFIG.PART_NUMBER);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create 3D space and styles
  const { space3D, scene } = create3DSpace(container);
  const style = addOrnamentStyles();
  
  // Load audio files
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_DING, COMMON_CONFIG.SOUND_FILE_DING);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_ENERGY, COMMON_CONFIG.SOUND_FILE_ENERGY);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_EXPLOSION, COMMON_CONFIG.SOUND_FILE_EXPLOSION);
  audioManager.loadSound(COMMON_CONFIG.SOUND_NAME_YAY, COMMON_CONFIG.SOUND_FILE_YAY);
  
  // Animation sequence
  async function animate() {
    // Create all ornaments at once (faster than part 1)
    boxes.forEach((coords, index) => {
      const ornament = createOrnament(scene, coords, index, PART2_CONFIG.ORNAMENT_OPTIONS);
      ornaments.push(ornament);
    });
    
    await new Promise(resolve => timers.push(setTimeout(resolve, PART2_CONFIG.INITIAL_WAIT_MS)));
    
    // Simulate the algorithm finding connections one by one
    const regularConnections = PART2_CONFIG.REGULAR_CONNECTIONS;
    const goldenConnection = PART2_CONFIG.GOLDEN_CONNECTION;
    
    // Create regular connections (keep counter at 0)
    for (let i = 0; i < regularConnections.length; i++) {
      const [from_idx, to_idx] = regularConnections[i];
      
      const line = createConnection(
        scene, 
        ornaments[from_idx], 
        ornaments[to_idx],
        { colorIndex: i, playSound: false }
      );
      connections.push(line);
      
      // Play subtle sound every few connections
      if (i % PART2_CONFIG.DING_SOUND_FREQUENCY === 0) {
        audioManager.play(COMMON_CONFIG.SOUND_NAME_DING, PART2_CONFIG.DING_VOLUME_SUBTLE);
      }
      
      await new Promise(resolve => timers.push(setTimeout(resolve, PART2_CONFIG.REGULAR_CONNECTION_DELAY_MS)));
    }
    
    // Dramatic pause before the golden connection
    await new Promise(resolve => timers.push(setTimeout(resolve, PART2_CONFIG.GOLDEN_PAUSE_MS)));
    
    // Highlight the two ornaments that will be connected
    const goldenFrom = ornaments[goldenConnection[0]];
    const goldenTo = ornaments[goldenConnection[1]];
    
    // Make them special (gold and larger)
    [goldenFrom, goldenTo].forEach(orn => {
      orn.style.color = COMMON_CONFIG.SPECIAL_COLOR;
      orn.style.animation = PART2_CONFIG.GOLDEN_ANIMATION;
      orn.textContent = PART2_CONFIG.GOLDEN_EMOJI;
      audioManager.play(COMMON_CONFIG.SOUND_NAME_ENERGY, PART2_CONFIG.ENERGY_VOLUME_GOLDEN);
    });
    
    // Add sparkles around them
    const [x1, y1, z1] = normalize([
      boxes[goldenConnection[0]][0],
      boxes[goldenConnection[0]][1],
      boxes[goldenConnection[0]][2]
    ]);
    const [x2, y2, z2] = normalize([
      boxes[goldenConnection[1]][0],
      boxes[goldenConnection[1]][1],
      boxes[goldenConnection[1]][2]
    ]);
    
    for (let i = 0; i < PART2_CONFIG.GOLDEN_SPARKLE_COUNT; i++) {
      timers.push(setTimeout(() => {
        createSparkle(scene, x1, y1, z1, COMMON_CONFIG.SPARKLE_EMOJI);
        createSparkle(scene, x2, y2, z2, COMMON_CONFIG.SPARKLE_EMOJI);
      }, i * PART2_CONFIG.GOLDEN_SPARKLE_DELAY_MS));
    }
    
    await new Promise(resolve => timers.push(setTimeout(resolve, PART2_CONFIG.GOLDEN_HIGHLIGHT_DURATION_MS)));
    
    // Create the GOLDEN connection
    const goldenLine = createConnection(
      scene,
      goldenFrom,
      goldenTo,
      { 
        colorIndex: 0,
        special: true,
        playSound: false
      }
    );
    connections.push(goldenLine);
    
    // Big celebration sound
    audioManager.play(COMMON_CONFIG.SOUND_NAME_EXPLOSION, PART2_CONFIG.EXPLOSION_VOLUME);
    
    // Create explosion of sparkles
    for (let i = 0; i < PART2_CONFIG.EXPLOSION_SPARKLE_COUNT; i++) {
      const delay = i * PART2_CONFIG.EXPLOSION_SPARKLE_DELAY_MS;
      timers.push(setTimeout(() => {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const midZ = (z1 + z2) / 2;
        const offsetX = (Math.random() - 0.5) * PART2_CONFIG.EXPLOSION_OFFSET_RANGE;
        const offsetY = (Math.random() - 0.5) * PART2_CONFIG.EXPLOSION_OFFSET_RANGE;
        const offsetZ = (Math.random() - 0.5) * PART2_CONFIG.EXPLOSION_OFFSET_RANGE;
        createSparkle(scene, midX + offsetX, midY + offsetY, midZ + offsetZ, PART2_CONFIG.GOLDEN_EMOJI);
      }, delay));
    };
    
    await new Promise(resolve => timers.push(setTimeout(resolve, PART2_CONFIG.GOLDEN_CONNECTION_WAIT_MS)));
    
    // Calculate final answer (product of coordinates)
    const answer = boxes[goldenConnection[0]][0] * boxes[goldenConnection[1]][0];
    counterBox.setValue(answer);
    
    // Check if correct and celebrate
    timers.push(setTimeout(() => {
      const expectedAnswer = PART2_CONFIG.EXPECTED_ANSWER;
      const isCorrect = counterBox.counterValue === expectedAnswer;
      
      if (isCorrect) {
        counterBox.markComplete();
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
        
        // Make all ornaments golden
        ornaments.forEach(orn => {
          orn.style.color = COMMON_CONFIG.SPECIAL_COLOR;
          orn.textContent = PART2_CONFIG.GOLDEN_EMOJI;
        });
        
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
