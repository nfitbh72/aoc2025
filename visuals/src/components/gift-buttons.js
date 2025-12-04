import '../styles/gift-buttons.css';
import { boxColors, ribbonColors, getRandomColor } from '../utils/colors.js';
import { loadVisualization } from './visualization.js';

function createGiftButton(day, part) {
  const button = document.createElement('button');
  button.className = 'gift-button';
  button.dataset.day = day;
  button.dataset.part = part;
  
  const boxColor = getRandomColor(boxColors);
  const ribbonColor = getRandomColor(ribbonColors);
  
  button.style.backgroundColor = boxColor;
  
  // Apply ribbon colors to pseudo-elements via inline style
  const styleSheet = document.styleSheets[0];
  const ruleIndex = styleSheet.cssRules.length;
  styleSheet.insertRule(
    `.gift-button[data-day="${day}"][data-part="${part}"]::before { background-color: ${ribbonColor}; }`,
    ruleIndex
  );
  styleSheet.insertRule(
    `.gift-button[data-day="${day}"][data-part="${part}"]::after { background-color: ${ribbonColor}; }`,
    ruleIndex + 1
  );
  
  const label = document.createElement('span');
  label.textContent = part;
  button.appendChild(label);
  
  button.addEventListener('click', () => {
    loadVisualization(day, part);
  });
  
  return button;
}

export function initializeButtons() {
  const container = document.getElementById('button-container');
  
  for (let day = 1; day <= 12; day++) {
    const dayGroup = document.createElement('div');
    dayGroup.className = 'day-group';
    
    const buttonPair = document.createElement('div');
    buttonPair.className = 'button-pair';
    
    const button1 = createGiftButton(day, 1);
    const button2 = createGiftButton(day, 2);
    
    buttonPair.appendChild(button1);
    buttonPair.appendChild(button2);
    
    const dayLabel = document.createElement('div');
    dayLabel.className = 'day-label';
    dayLabel.textContent = day;
    
    dayGroup.appendChild(buttonPair);
    dayGroup.appendChild(dayLabel);
    
    container.appendChild(dayGroup);
  }
}
