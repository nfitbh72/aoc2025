import { Battery } from '../../battery.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day 3 Part 2 visualization - Stack Algorithm
 */
export default function visualize(container, onComplete) {
  // Load sounds
  audioManager.loadSound('battery-complete', 'ding.mp3');
  audioManager.loadSound('digit-explode', 'explosion.mp3');
  audioManager.loadSound('digit-add', 'click.mp3');
  const batteries = [];
  const batteryNumbers = [
    '987654321111111',
    '811111111111119',
    '234234234234278',
    '818181911112111'
  ];
  
  // Christmas colors: red and green alternating
  const colors = ['#c41e3a', '#0f8a5f', '#c41e3a', '#0f8a5f'];
  
  const instructionText = 'Find the largest 12-digit number from each line by combining digits in order, then sum them all.';
  const counterLabel = 'Total Sum';
  
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  let displaySum = 0;
  
  // Create counter and instruction panel
  counterBox = new CounterBox(container, counterLabel);
  instructionPanel = new InstructionPanel(container, instructionText);
  counterBox.setValue(0);
  
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
    left: 40%;
    transform: translate(-50%, -50%);
  `;
  container.appendChild(batteryContainer);
  
  // Create all batteries with animated digits
  batteryNumbers.forEach((number, index) => {
    const batteryWrapper = document.createElement('div');
    batteryWrapper.style.cssText = `
      display: flex;
      align-items: center;
      gap: 20px;
    `;
    
    const battery = createAnimatedBattery(batteryWrapper, number, colors[index]);
    batteries.push(battery);
    batteryContainer.appendChild(batteryWrapper);
  });
  
  // Animate through all batteries
  let batteryIndex = 0;
  const delayPerStep = 300; // ms between each step
  
  function animateNextBattery() {
    if (batteryIndex >= batteries.length) {
      // All done
      setTimeout(() => {
        counterBox.markComplete();
        fireworks = celebrate(container, 5000);
        
        if (onComplete) {
          onComplete();
        }
      }, 500);
      return;
    }
    
    const battery = batteries[batteryIndex];
    animateStackAlgorithm(battery, delayPerStep, () => {
      // Battery complete, play ding sound and update counter
      audioManager.play('battery-complete', 0.6);
      displaySum += parseInt(battery.finalNumber);
      counterBox.setValue(displaySum);
      batteryIndex++;
      setTimeout(animateNextBattery, 500);
    });
  }
  
  setTimeout(animateNextBattery, 500);
  
  return {
    cleanup: () => {
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

function createAnimatedBattery(container, numberString, color) {
  const resultDigitLength = 12;
  const totalDigits = numberString.length; // 15
  const maxDrops = totalDigits - resultDigitLength; // 3
  
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
  `;
  
  // Drop counter
  const dropCounter = document.createElement('div');
  dropCounter.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    min-width: 60px;
  `;
  
  const dropLabel = document.createElement('div');
  dropLabel.textContent = 'Drops';
  dropLabel.style.cssText = `
    font-size: 12px;
    color: #888;
    font-weight: bold;
  `;
  
  const dropValue = document.createElement('div');
  dropValue.textContent = maxDrops;
  dropValue.style.cssText = `
    font-size: 24px;
    color: #ffd700;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  `;
  
  dropCounter.appendChild(dropLabel);
  dropCounter.appendChild(dropValue);
  wrapper.appendChild(dropCounter);
  
  // Battery body
  const body = document.createElement('div');
  body.style.cssText = `
    flex: 1;
    height: 80px;
    background: linear-gradient(180deg, ${color}dd 0%, ${color} 50%, ${color}aa 100%);
    border: 4px solid ${color};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: visible;
    padding: 0 20px;
  `;
  
  // Shine effect
  const shine = document.createElement('div');
  shine.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%);
    border-radius: 8px 8px 0 0;
    pointer-events: none;
  `;
  body.appendChild(shine);
  
  // Digit container
  const digitContainer = document.createElement('div');
  digitContainer.style.cssText = `
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    z-index: 1;
    position: relative;
  `;
  
  // Create digit elements array (but don't add to DOM yet)
  const digits = [];
  for (let i = 0; i < numberString.length; i++) {
    const digitSpan = document.createElement('span');
    digitSpan.textContent = numberString[i];
    digitSpan.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
      display: inline-block;
      transition: all 0.3s ease;
      opacity: 0;
      transform: scale(0);
    `;
    digitSpan.dataset.index = i;
    digitSpan.dataset.value = numberString[i];
    digits.push(digitSpan);
  }
  
  body.appendChild(digitContainer);
  
  // Battery terminal
  const terminal = document.createElement('div');
  terminal.style.cssText = `
    width: 28px;
    height: 50px;
    background: linear-gradient(180deg, ${color}dd 0%, ${color} 50%, ${color}aa 100%);
    border: 4px solid ${color};
    border-left: none;
    border-radius: 0 8px 8px 0;
    margin-left: -20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;
  
  // Max value display
  const maxValueDisplay = document.createElement('div');
  maxValueDisplay.style.cssText = `
    font-family: 'Courier New', monospace;
    font-size: 36px;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
    min-width: 100px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  maxValueDisplay.textContent = '--';
  
  wrapper.appendChild(body);
  wrapper.appendChild(terminal);
  wrapper.appendChild(maxValueDisplay);
  container.appendChild(wrapper);
  
  return {
    wrapper,
    body,
    digitContainer,
    digits,
    maxValueDisplay,
    dropValue,
    numberString,
    resultDigitLength,
    maxDrops,
    finalNumber: '',
    cleanup: () => {
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };
}

function animateStackAlgorithm(battery, delay, onComplete) {
  const { digits, numberString, resultDigitLength, maxDrops, maxValueDisplay, dropValue } = battery;
  const stack = [];
  let drop = maxDrops;
  let currentIndex = 0;
  
  function processNextDigit() {
    if (currentIndex >= numberString.length) {
      // Trim stack to resultDigitLength by exploding extra digits from the end
      function trimStack() {
        if (stack.length > resultDigitLength) {
          const popped = stack.pop();
          drop--;
          
          // Update drop counter
          dropValue.textContent = drop;
          dropValue.style.animation = 'counterPop 0.3s ease-out';
          setTimeout(() => { dropValue.style.animation = ''; }, 300);
          
          explodeDigit(popped.element);
          
          setTimeout(() => {
            respaceDigits(battery);
            setTimeout(trimStack, delay);
          }, delay / 2);
        } else {
          // Show final result
          const finalNumber = stack.map(item => item.value).join('');
          battery.finalNumber = finalNumber;
          maxValueDisplay.textContent = finalNumber;
          maxValueDisplay.style.opacity = '1';
          
          setTimeout(onComplete, 300);
        }
      }
      
      trimStack();
      return;
    }
    
    const c = numberString[currentIndex];
    const currentDigit = digits[currentIndex];
    
    setTimeout(() => {
      // First, push current digit to stack
      stack.push({ value: c, element: currentDigit });
      
      // Add digit to DOM and animate it in
      battery.digitContainer.appendChild(currentDigit);
      
      // Play click sound when digit is added
      audioManager.play('digit-add', 0.3);
      
      // Trigger animation
      setTimeout(() => {
        currentDigit.style.opacity = '1';
        currentDigit.style.transform = 'scale(1)';
      }, 10);
      
      // Re-space digits
      setTimeout(() => {
        respaceDigits(battery);
      }, 100);
      
      // Then check if we need to pop from stack (remove smaller digits before this one)
      setTimeout(() => {
        function popNext() {
          // Check if we should pop the digit BEFORE the current one
          if (drop > 0 && stack.length > 1 && stack[stack.length - 2].value < c) {
            // Remove the second-to-last element (the one before current)
            const popped = stack.splice(stack.length - 2, 1)[0];
            drop--;
            
            // Update drop counter
            dropValue.textContent = drop;
            dropValue.style.animation = 'counterPop 0.3s ease-out';
            setTimeout(() => { dropValue.style.animation = ''; }, 300);
            
            // Explode the popped digit
            explodeDigit(popped.element);
            
            setTimeout(() => {
              respaceDigits(battery);
              setTimeout(popNext, delay);
            }, delay / 2);
          } else {
            // Done popping, move to next digit
            currentIndex++;
            setTimeout(processNextDigit, delay);
          }
        }
        
        popNext();
      }, 200);
    }, delay / 2);
  }
  
  processNextDigit();
}

function explodeDigit(digitElement) {
  // Play explosion sound
  audioManager.play('digit-explode', 0.4);
  
  digitElement.style.transition = 'all 0.5s ease-out';
  digitElement.style.transform = 'scale(2) rotate(360deg)';
  digitElement.style.opacity = '0';
  
  setTimeout(() => {
    if (digitElement.parentNode) {
      digitElement.parentNode.removeChild(digitElement);
    }
  }, 500);
}

function respaceDigits(battery) {
  // Re-center and space the remaining digits
  const remainingDigits = Array.from(battery.digitContainer.children);
  remainingDigits.forEach(digit => {
    digit.style.transition = 'all 0.3s ease';
  });
}
