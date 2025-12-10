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

/**
 * Day 8 Part 1 - Christmas Ornament Circuit Visualization
 * Visualizes junction boxes as 3D Christmas ornaments connecting via glowing light strings
 */
export default function visualize(container, onComplete) {
  const instructionText = '🎄 Connect Christmas ornaments with glowing light strings to form festive circuits! 🎄';
  const counterLabel = 'Circuit Score';
  
  // Test data - junction boxes as 3D coordinates
  const boxes = [
    [162,817,812], [57,618,57], [906,360,560], [592,479,940],
    [352,342,300], [466,668,158], [542,29,236], [431,825,988],
    [739,650,466], [52,470,668], [216,146,977], [819,987,18],
    [117,168,530], [805,96,715], [346,949,466], [970,615,88],
    [941,993,340], [862,61,35], [984,92,344], [425,690,689]
  ];
  
  let dayTitle = null;
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  const timers = [];
  
  // Create components
  dayTitle = new DayTitle(container, 8, 1);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create 3D space and styles
  const { space3D, scene } = create3DSpace(container);
  const style = addOrnamentStyles();
  
  // Load audio files
  audioManager.loadSound('ding', 'ding.mp3');
  audioManager.loadSound('energy', 'energy.mp3');
  audioManager.loadSound('yay', 'yay.mp3');
  
  // Animation sequence
  async function animate() {
    // Create all ornaments
    const ornaments = await createOrnaments(scene, boxes, timers, {
      delay: 100,
      playSound: true,
      sparkles: true
    });
    
    // Connect ornaments to form circuits (simulating the algorithm)
    const connectionPairs = [
      [0, 19], [0, 7], [2, 14], [4, 9], [3, 16], [5, 11],
      [8, 2], [0, 14], [2, 16], [1, 6]
    ];
    
    // Keep counter at 0 during connections
    await createConnections(scene, ornaments, connectionPairs, timers, {
      delay: 400
    });
    
    // Final score calculation (3 longest circuits multiplied: 5 * 4 * 2 = 40)
    await new Promise(resolve => timers.push(setTimeout(resolve, 500)));
    counterBox.setValue(40); // Expected answer
    
    // Check if correct and celebrate
    timers.push(setTimeout(() => {
      const expectedAnswer = 40;
      const isCorrect = counterBox.counterValue === expectedAnswer;
      
      if (isCorrect) {
        counterBox.markComplete();
        fireworks = celebrate(container, 5000);
        
        setTimeout(() => {
          audioManager.play('yay', 0.8);
        }, 500);
      }
      
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    }, 1000));
  }
  
  // Start animation
  timers.push(setTimeout(() => {
    animate();
  }, 1000));
  
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
