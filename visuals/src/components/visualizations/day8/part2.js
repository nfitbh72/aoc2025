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

/**
 * Day 8 Part 2 - Find the Golden Connection
 * Visualizes finding the specific connection that unites all ornaments into a single circuit
 */
export default function visualize(container, onComplete) {
  const instructionText = '⭐ Find the GOLDEN connection that unites all ornaments into one magical circuit! ⭐';
  const counterLabel = 'Connections';
  
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
  const ornaments = [];
  const connections = [];
  
  // Create components
  dayTitle = new DayTitle(container, 8, 2);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create 3D space and styles
  const { space3D, scene } = create3DSpace(container);
  const style = addOrnamentStyles();
  
  // Load audio files
  audioManager.loadSound('ding', 'ding.mp3');
  audioManager.loadSound('energy', 'energy.mp3');
  audioManager.loadSound('explosion', 'explosion.mp3');
  audioManager.loadSound('yay', 'yay.mp3');
  
  // Animation sequence
  async function animate() {
    // Create all ornaments at once (faster than part 1)
    boxes.forEach((coords, index) => {
      const ornament = createOrnament(scene, coords, index, {
        emoji: '🎄',
        interactive: true
      });
      ornaments.push(ornament);
    });
    
    await new Promise(resolve => timers.push(setTimeout(resolve, 500)));
    
    // Simulate the algorithm finding connections one by one
    // These are the connections processed before finding the golden one
    const regularConnections = [
      [0, 19], [0, 7], [2, 14], [0, 7], [4, 16], [9, 12],
      [11, 17], [8, 2], [14, 0], [2, 16], [1, 6], [5, 11],
      [13, 2], [15, 18], [3, 9], [7, 0], [10, 12], [14, 8],
      [16, 13], [6, 7], [18, 17], [19, 7], [12, 13], [17, 18],
      [11, 5], [16, 2], [9, 3], [13, 16]
    ];
    
    // The golden connection (29th iteration) - connects box 10 and 12
    const goldenConnection = [10, 12];
    
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
      if (i % 3 === 0) {
        audioManager.play('ding', 0.2);
      }
      
      await new Promise(resolve => timers.push(setTimeout(resolve, 150)));
    }
    
    // Dramatic pause before the golden connection
    await new Promise(resolve => timers.push(setTimeout(resolve, 1000)));
    
    // Highlight the two ornaments that will be connected
    const goldenFrom = ornaments[goldenConnection[0]];
    const goldenTo = ornaments[goldenConnection[1]];
    
    // Make them special (gold and larger)
    [goldenFrom, goldenTo].forEach(orn => {
      orn.style.color = 'gold';
      orn.style.animation = 'specialGlow 1s ease-in-out infinite';
      orn.textContent = '⭐';
      audioManager.play('energy', 0.6);
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
    
    for (let i = 0; i < 5; i++) {
      timers.push(setTimeout(() => {
        createSparkle(scene, x1, y1, z1, '✨');
        createSparkle(scene, x2, y2, z2, '✨');
      }, i * 200));
    }
    
    await new Promise(resolve => timers.push(setTimeout(resolve, 1500)));
    
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
    audioManager.play('explosion', 0.7);
    
    // Create explosion of sparkles
    for (let i = 0; i < 20; i++) {
      const delay = i * 50;
      timers.push(setTimeout(() => {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const midZ = (z1 + z2) / 2;
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        const offsetZ = (Math.random() - 0.5) * 100;
        createSparkle(scene, midX + offsetX, midY + offsetY, midZ + offsetZ, '⭐');
      }, delay));
    };
    
    await new Promise(resolve => timers.push(setTimeout(resolve, 1500)));
    
    // Calculate final answer (product of coordinates)
    const answer = boxes[goldenConnection[0]][0] * boxes[goldenConnection[1]][0];
    counterBox.setValue(answer);
    
    // Check if correct and celebrate
    timers.push(setTimeout(() => {
      const expectedAnswer = 25272; // 216 * 117 = 25272
      const isCorrect = counterBox.counterValue === expectedAnswer;
      
      if (isCorrect) {
        counterBox.markComplete();
        fireworks = celebrate(container, 5000);
        
        // Make all ornaments golden
        ornaments.forEach(orn => {
          orn.style.color = 'gold';
          orn.textContent = '⭐';
        });
        
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
