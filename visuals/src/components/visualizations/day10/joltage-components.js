import { COMMON_CONFIG, PART2_CONFIG } from './config.js';

/**
 * Creates a joltage meter display for Part 2
 */
export function createJoltageDisplay(machineDiv, joltageNeeded) {
  const joltageContainer = document.createElement('div');
  joltageContainer.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: ${PART2_CONFIG.JOLTAGE_BAR_SPACING}px;
    margin: 15px 0;
    height: ${PART2_CONFIG.JOLTAGE_BAR_HEIGHT + 60}px;
  `;

  const meters = [];
  for (let i = 0; i < joltageNeeded.length; i++) {
    const meterWrapper = document.createElement('div');
    meterWrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    `;

    // Create the meter bar
    const meterBar = document.createElement('div');
    meterBar.style.cssText = `
      width: ${PART2_CONFIG.JOLTAGE_BAR_WIDTH}px;
      height: ${PART2_CONFIG.JOLTAGE_BAR_HEIGHT}px;
      background: ${PART2_CONFIG.JOLTAGE_BAR_BACKGROUND};
      border: ${PART2_CONFIG.JOLTAGE_BAR_BORDER};
      border-radius: ${PART2_CONFIG.JOLTAGE_BAR_BORDER_RADIUS};
      position: relative;
      overflow: hidden;
    `;

    // Create the fill
    const meterFill = document.createElement('div');
    meterFill.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0%;
      background: ${PART2_CONFIG.JOLTAGE_FILL_UNDER};
      transition: all ${PART2_CONFIG.JOLTAGE_FILL_TRANSITION * COMMON_CONFIG.SPEED_MULTIPLIER}s ease;
    `;
    meterBar.appendChild(meterFill);

    // Create current value display
    const currentValue = document.createElement('div');
    currentValue.textContent = '0';
    currentValue.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: ${PART2_CONFIG.JOLTAGE_VALUE_FONT_SIZE};
      font-weight: bold;
      color: ${PART2_CONFIG.JOLTAGE_VALUE_COLOR};
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
      z-index: 10;
    `;
    meterBar.appendChild(currentValue);

    meterWrapper.appendChild(meterBar);

    // Create target label
    const targetLabel = document.createElement('div');
    targetLabel.textContent = `⚡${joltageNeeded[i]}`;
    targetLabel.style.cssText = `
      font-size: ${PART2_CONFIG.JOLTAGE_TARGET_FONT_SIZE};
      font-weight: bold;
      color: ${PART2_CONFIG.JOLTAGE_TARGET_COLOR};
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.6);
    `;
    meterWrapper.appendChild(targetLabel);

    // Create index label
    const indexLabel = document.createElement('div');
    indexLabel.textContent = `#${i}`;
    indexLabel.style.cssText = `
      font-size: ${PART2_CONFIG.JOLTAGE_LABEL_FONT_SIZE};
      color: ${PART2_CONFIG.JOLTAGE_LABEL_COLOR};
      opacity: 0.6;
    `;
    meterWrapper.appendChild(indexLabel);

    joltageContainer.appendChild(meterWrapper);

    meters.push({
      bar: meterBar,
      fill: meterFill,
      valueDisplay: currentValue,
      targetValue: joltageNeeded[i],
      currentValue: 0
    });
  }

  machineDiv.appendChild(joltageContainer);
  return meters;
}

/**
 * Updates a joltage meter value
 */
export function updateJoltageMeter(meter, newValue) {
  meter.currentValue = newValue;
  meter.valueDisplay.textContent = newValue.toString();

  // Calculate percentage (with some headroom for over values)
  const maxValue = Math.max(meter.targetValue, newValue) * 1.2;
  const percentage = (newValue / maxValue) * 100;
  meter.fill.style.height = `${Math.min(percentage, 100)}%`;

  // Update color based on status
  if (newValue === meter.targetValue) {
    // Perfect match - green
    meter.fill.style.background = PART2_CONFIG.JOLTAGE_FILL_MATCH;
    meter.bar.style.boxShadow = PART2_CONFIG.JOLTAGE_MATCH_GLOW;
    meter.valueDisplay.style.color = PART2_CONFIG.JOLTAGE_TARGET_COLOR;
  } else if (newValue > meter.targetValue) {
    // Over - red
    meter.fill.style.background = PART2_CONFIG.JOLTAGE_FILL_OVER;
    meter.bar.style.boxShadow = PART2_CONFIG.JOLTAGE_OVER_GLOW;
    meter.valueDisplay.style.color = '#ff0000';
  } else {
    // Under - cyan
    meter.fill.style.background = PART2_CONFIG.JOLTAGE_FILL_UNDER;
    meter.bar.style.boxShadow = 'none';
    meter.valueDisplay.style.color = PART2_CONFIG.JOLTAGE_VALUE_COLOR;
  }

  // Pulse animation
  meter.fill.style.transform = 'scaleX(1.1)';
  setTimeout(() => {
    meter.fill.style.transform = 'scaleX(1)';
  }, PART2_CONFIG.JOLTAGE_PULSE_DURATION * COMMON_CONFIG.SPEED_MULTIPLIER * 1000);
}

/**
 * Increments joltage at specific positions based on button press
 */
export function incrementJoltage(meters, buttonIndices) {
  const updatedMeters = [];

  for (const idx of buttonIndices) {
    if (idx < meters.length) {
      const meter = meters[idx];
      const newValue = meter.currentValue + 1;
      updateJoltageMeter(meter, newValue);
      updatedMeters.push(meter);
    }
  }

  return updatedMeters;
}

/**
 * Checks if all joltage meters match their targets
 */
export function checkJoltageMatch(meters) {
  return meters.every(meter => meter.currentValue === meter.targetValue);
}

/**
 * Checks if any joltage meter is over its target
 */
export function checkJoltageOver(meters) {
  return meters.some(meter => meter.currentValue > meter.targetValue);
}

/**
 * Parses a machine for Part 2 (no lights, includes joltage)
 */
export function parseMachinePart2(line) {
  const machine = {
    buttons: [],
    joltageNeeded: []
  };

  // Parse buttons (same as Part 1)
  const buttonsMatch = line.match(/\](.*?)\{/);
  if (buttonsMatch) {
    const buttonsStr = buttonsMatch[1];
    const buttonMatches = buttonsStr.matchAll(/\(([^)]+)\)/g);
    for (const match of buttonMatches) {
      const indices = match[1].split(',').map(s => parseInt(s.trim()));
      machine.buttons.push(indices);
    }
  }

  // Parse joltage
  const joltageMatch = line.match(/\{([^}]+)\}/);
  if (joltageMatch) {
    machine.joltageNeeded = joltageMatch[1].split(',').map(s => parseInt(s.trim()));
  }

  return machine;
}

/**
 * Solves a Part 2 machine using recursive algorithm (simplified)
 * Returns array of button press counts [button0Presses, button1Presses, ...]
 */
export function solveMachinePart2(machine) {
  let bestSolution = null;
  let bestPresses = Infinity;

  // Calculate max presses for each button
  const maxPresses = machine.buttons.map(button => {
    let max = 0;
    for (const pos of button) {
      if (pos < machine.joltageNeeded.length && machine.joltageNeeded[pos] > max) {
        max = machine.joltageNeeded[pos];
      }
    }
    return max;
  });

  /**
   * Recursive function to try button combinations
   */
  function tryButtons(buttonIdx, buttonPresses, currentJoltage) {
    // Check if current joltage is over any target
    for (let i = 0; i < currentJoltage.length; i++) {
      if (currentJoltage[i] > machine.joltageNeeded[i]) {
        return; // Over - abort this path
      }
    }

    // If we've processed all buttons, check if we have a solution
    if (buttonIdx >= machine.buttons.length) {
      // Check if all joltages match
      const allMatch = currentJoltage.every((val, i) => val === machine.joltageNeeded[i]);
      if (allMatch) {
        const totalPresses = buttonPresses.reduce((a, b) => a + b, 0);
        if (totalPresses < bestPresses) {
          bestPresses = totalPresses;
          bestSolution = [...buttonPresses];
        }
      }
      return;
    }

    // Try pressing this button 0 to maxPresses times
    for (let presses = 0; presses <= maxPresses[buttonIdx]; presses++) {
      const newJoltage = [...currentJoltage];
      const newPresses = [...buttonPresses];
      newPresses[buttonIdx] = presses;

      // Apply presses
      for (let i = 0; i < presses; i++) {
        for (const joltageIdx of machine.buttons[buttonIdx]) {
          if (joltageIdx < newJoltage.length) {
            newJoltage[joltageIdx]++;
          }
        }
      }

      // Recurse to next button
      tryButtons(buttonIdx + 1, newPresses, newJoltage);
    }
  }

  // Start recursion
  const initialJoltage = new Array(machine.joltageNeeded.length).fill(0);
  const initialPresses = new Array(machine.buttons.length).fill(0);
  tryButtons(0, initialPresses, initialJoltage);

  return bestSolution;
}
