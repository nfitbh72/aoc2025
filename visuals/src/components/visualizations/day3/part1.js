import { Battery } from '../../battery.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 3 Part 1 visualization - Christmas Battery Display
 */
export default function visualize(container, onComplete) {
  // Load ding sound
  audioManager.loadSound('max-update', 'ding.mp3');
  const batteries = [];
  const batteryNumbers = [
    '987654321111111',
    '811111111111119',
    '234234234234278',
    '818181911112111'
  ];
  
  // Christmas colors: red and green alternating
  const colors = ['#c41e3a', '#0f8a5f', '#c41e3a', '#0f8a5f'];
  
  const instructionText = 'Find the largest 2-digit number from each line by combining digits in order, then sum them all.';
  const counterLabel = 'Total Joltage';
  
  let counterBox = null;
  let instructionPanel = null;
  let dayTitle = null;
  let fireworks = null;
  
  // Create title, counter and instruction panel
  dayTitle = new DayTitle(container, 3, 1);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create battery container
  const batteryContainer = document.createElement('div');
  batteryContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 1000px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  container.appendChild(batteryContainer);
  
  // Create all batteries
  batteryNumbers.forEach((number, index) => {
    const battery = new Battery(batteryContainer, number, colors[index]);
    batteries.push(battery);
  });
  
  // Animate through all digit pairs for each battery
  let currentSum = 0;
  let displaySum = 0;
  let animationIndex = 0;
  const delayPerPair = 100; // ms between each pair highlight
  
  // Initialize counter at 0
  counterBox.setValue(0);
  
  // Generate all pairs for all batteries
  const allPairs = [];
  batteryNumbers.forEach((line, batteryIndex) => {
    const pairs = [];
    for (let i = 0; i < line.length; i++) {
      for (let j = i + 1; j < line.length; j++) {
        pairs.push({
          batteryIndex,
          i,
          j,
          value: parseInt(line[i] + line[j])
        });
      }
    }
    // Sort pairs for this battery to find the max
    pairs.sort((a, b) => a.value - b.value);
    const maxPair = pairs[pairs.length - 1];
    
    allPairs.push({
      batteryIndex,
      pairs,
      maxPair
    });
    
    currentSum += maxPair.value;
  });
  
  // Animate through pairs
  function animateNextPair() {
    if (animationIndex >= allPairs.length) {
      // Animation complete - clear all highlights
      batteries.forEach(b => b.clearHighlight());
      setTimeout(() => {
        counterBox.markComplete();
        fireworks = celebrate(container, 5000);
        
        if (onComplete) {
          onComplete();
        }
      }, 500);
      return;
    }
    
    const { batteryIndex, pairs, maxPair } = allPairs[animationIndex];
    const battery = batteries[batteryIndex];
    let pairIndex = 0;
    let currentMax = 0;
    
    function highlightNextPairInBattery() {
      if (pairIndex >= pairs.length) {
        // Done with this battery, add max to counter and move to next
        battery.clearHighlight();
        displaySum += currentMax;
        counterBox.setValue(displaySum);
        animationIndex++;
        setTimeout(animateNextPair, 300);
        return;
      }
      
      const pair = pairs[pairIndex];
      battery.setHighlightPositions([pair.i, pair.j]);
      
      // Update max value if this pair is higher
      if (pair.value > currentMax) {
        currentMax = pair.value;
        battery.updateMaxValue(currentMax);
        // Play ding sound when max value updates
        audioManager.play('max-update', 0.5);
      }
      
      pairIndex++;
      setTimeout(highlightNextPairInBattery, delayPerPair);
    }
    
    highlightNextPairInBattery();
  }
  
  // Start animation after a short delay
  setTimeout(animateNextPair, 500);
  
  return {
    cleanup: () => {
      if (dayTitle) {
        dayTitle.cleanup();
      }
      if (counterBox) {
        counterBox.cleanup();
      }
      if (instructionPanel) {
        instructionPanel.cleanup();
      }
      batteries.forEach(battery => battery.cleanup());
      if (batteryContainer && batteryContainer.parentNode) {
        batteryContainer.parentNode.removeChild(batteryContainer);
      }
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
