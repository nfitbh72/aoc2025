import '../styles/gift-buttons.css';
import { boxColors, getRandomColor, getContrastingRibbon } from '../utils/colors.js';
import { loadVisualization } from './visualization.js';

function createGiftButton(day, part) {
  const container = document.createElement('div');
  container.className = 'gift-box-container';
  container.dataset.day = day;
  container.dataset.part = part;
  
  const boxColor = getRandomColor(boxColors);
  const ribbonColor = getContrastingRibbon(boxColor);
  
  // Create the box structure
  const box = document.createElement('div');
  box.className = 'gift-box';
  
  // Box body
  const body = document.createElement('div');
  body.className = 'box-body';
  body.style.backgroundColor = boxColor;
  
  // Box lid (opens on click)
  const lid = document.createElement('div');
  lid.className = 'box-lid';
  lid.style.backgroundColor = boxColor;
  
  // Ribbon on lid
  const lidRibbonVertical = document.createElement('div');
  lidRibbonVertical.className = 'ribbon-vertical';
  lidRibbonVertical.style.backgroundColor = ribbonColor;
  
  const lidRibbonHorizontal = document.createElement('div');
  lidRibbonHorizontal.className = 'ribbon-horizontal';
  lidRibbonHorizontal.style.backgroundColor = ribbonColor;
  
  const bow = document.createElement('div');
  bow.className = 'bow';
  bow.style.borderColor = ribbonColor;
  
  lid.appendChild(lidRibbonVertical);
  lid.appendChild(lidRibbonHorizontal);
  lid.appendChild(bow);
  
  // Ribbon on body (behind label)
  const bodyRibbonVertical = document.createElement('div');
  bodyRibbonVertical.className = 'ribbon-vertical body-ribbon';
  bodyRibbonVertical.style.backgroundColor = ribbonColor;
  
  const bodyRibbonHorizontal = document.createElement('div');
  bodyRibbonHorizontal.className = 'ribbon-horizontal body-ribbon';
  bodyRibbonHorizontal.style.backgroundColor = ribbonColor;
  
  body.appendChild(bodyRibbonVertical);
  body.appendChild(bodyRibbonHorizontal);
  
  // Part label inside box
  const label = document.createElement('div');
  label.className = 'part-label';
  label.textContent = part;
  
  body.appendChild(label);
  box.appendChild(body);
  box.appendChild(lid);
  container.appendChild(box);
  
  // Click handler with animation
  container.addEventListener('click', () => {
    // Add opening animation
    lid.classList.add('opening');
    
    // Load visualization after animation starts, passing lid reference
    setTimeout(() => {
      loadVisualization(day, part, lid);
    }, 300);
  });
  
  return container;
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
