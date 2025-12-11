import { Battery } from '../../battery.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { DayTitle } from '../../day-title.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';
import { COMMON_CONFIG, PART1_CONFIG } from './config.js';

/**
 * Day 3 Part 1 visualization - Christmas Battery Display
 */
export default function visualize(container, onComplete) {
  // Load ding sound
  audioManager.loadSound(PART1_CONFIG.SOUND_NAME_MAX_UPDATE, COMMON_CONFIG.SOUND_FILE_DING);
  const batteries = [];
  const batteryNumbers = COMMON_CONFIG.TEST_BATTERY_NUMBERS;
  const colors = COMMON_CONFIG.BATTERY_COLORS;
  const instructionText = PART1_CONFIG.INSTRUCTION_TEXT;
  const counterLabel = COMMON_CONFIG.COUNTER_LABEL;
  
  let counterBox = null;
  let instructionPanel = null;
  let dayTitle = null;
  let fireworks = null;
  
  // Create title, counter and instruction panel
  dayTitle = new DayTitle(container, PART1_CONFIG.DAY_NUMBER, PART1_CONFIG.PART_NUMBER);
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  
  // Create battery container
  const batteryContainer = document.createElement('div');
  batteryContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: ${COMMON_CONFIG.BATTERY_GAP}px;
    max-width: ${COMMON_CONFIG.BATTERY_CONTAINER_MAX_WIDTH}px;
    margin: 0 auto;
    position: absolute;
    top: ${COMMON_CONFIG.BATTERY_CONTAINER_TOP};
    left: ${COMMON_CONFIG.BATTERY_CONTAINER_LEFT};
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
  const delayPerPair = PART1_CONFIG.DELAY_PER_PAIR_MS;
  
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
        fireworks = celebrate(container, COMMON_CONFIG.FIREWORKS_DURATION_MS);
        
        if (onComplete) {
          onComplete();
        }
      }, COMMON_CONFIG.COMPLETION_DELAY_MS);
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
        setTimeout(animateNextPair, PART1_CONFIG.BATTERY_COMPLETE_DELAY_MS);
        return;
      }
      
      const pair = pairs[pairIndex];
      battery.setHighlightPositions([pair.i, pair.j]);
      
      // Update max value if this pair is higher
      if (pair.value > currentMax) {
        currentMax = pair.value;
        battery.updateMaxValue(currentMax);
        // Play ding sound when max value updates
        audioManager.play(PART1_CONFIG.SOUND_NAME_MAX_UPDATE, COMMON_CONFIG.DING_VOLUME);
      }
      
      pairIndex++;
      setTimeout(highlightNextPairInBattery, delayPerPair);
    }
    
    highlightNextPairInBattery();
  }
  
  // Start animation after a short delay
  setTimeout(animateNextPair, COMMON_CONFIG.START_DELAY_MS);
  
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
