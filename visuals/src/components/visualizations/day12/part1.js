import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';

/**
 * Day 12 Part 1 visualization
 */
export default function visualize(container, onComplete) {
  const instructionText = '';
  const counterLabel = '';
  
  let counterBox = null;
  let instructionPanel = null;
  let fireworks = null;
  
  // Create counter and instruction panel
  counterBox = new CounterBox(container, counterLabel);
  if (instructionText) {
    instructionPanel = new InstructionPanel(container, instructionText);
  }
  
  // Placeholder: Auto-complete after a short delay
  setTimeout(() => {
    counterBox.markComplete();
    fireworks = celebrate(container, 5000);
    
    if (onComplete) {
      onComplete();
    }
  }, 2000);
  
  return {
    cleanup: () => {
      if (counterBox) {
        counterBox.cleanup();
      }
      if (instructionPanel) {
        instructionPanel.cleanup();
      }
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
