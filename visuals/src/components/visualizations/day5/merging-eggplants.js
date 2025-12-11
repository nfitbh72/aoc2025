import { audioManager } from '../../../utils/audio.js';
import { createWoodenRuler, createEggplant } from './wooden-ruler.js';
import { PART2_CONFIG } from './config.js';

/**
 * Merging Eggplants component for Day 5 Part 2
 * Shows ranges merging together as eggplants combine
 */
export class MergingEggplants {
  constructor(container, ranges, counterBox = null) {
    this.container = container;
    this.initialRanges = ranges; // Array of {lower, upper}
    this.counterBox = counterBox;
    this.currentRanges = [...ranges];
    
    // Fixed scale from 0 to 35
    this.minValue = 0;
    this.maxValue = 35;
    this.scale = 800 / (this.maxValue - this.minValue);
    
    this.createElements();
  }
  
  createElements() {
    // Main container
    this.element = document.createElement('div');
    this.element.className = 'merging-eggplants';
    this.element.style.cssText = `
      position: relative;
      width: 900px;
      margin: 40px auto;
      padding: 20px;
    `;
    
    // Title
    const title = document.createElement('div');
    title.textContent = '🍆 Merging Eggplant Ranges 🍆';
    title.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
      color: #663399;
    `;
    this.element.appendChild(title);
    
    // Ruler container
    this.rulerContainer = document.createElement('div');
    this.rulerContainer.style.cssText = `
      position: relative;
      height: 400px;
      margin: 20px 0;
    `;
    this.element.appendChild(this.rulerContainer);
    
    // Create ruler using shared function
    this.ruler = createWoodenRuler(this.rulerContainer, this.minValue, this.maxValue);
    
    // Status display
    this.statusDisplay = document.createElement('div');
    this.statusDisplay.style.cssText = `
      font-size: 18px;
      text-align: center;
      margin-top: 20px;
      color: #666;
      min-height: 30px;
    `;
    this.element.appendChild(this.statusDisplay);
    
    this.container.appendChild(this.element);
  }
  
  
  async showInitialRanges() {
    this.statusDisplay.textContent = 'Initial ranges...';
    
    const eggplants = [];
    this.initialRanges.forEach((range, index) => {
      const y = 120 + (index % 3) * 80;
      const eggplant = createEggplant(range, y, `initial-${index}`, this.scale, this.minValue);
      this.rulerContainer.appendChild(eggplant);
      eggplants.push(eggplant);
    });
    
    await this.delay(PART2_CONFIG.INITIAL_SHOW_DELAY_MS);
    return eggplants;
  }
  
  async mergeRanges() {
    this.statusDisplay.textContent = 'Merging overlapping ranges...';
    
    let changed = true;
    let iteration = 0;
    
    while (changed) {
      changed = false;
      const newRanges = [];
      
      for (const range of this.currentRanges) {
        let merged = false;
        
        for (let i = 0; i < newRanges.length; i++) {
          const existing = newRanges[i];
          
          // Check if ranges overlap or are adjacent
          if (range.lower <= existing.upper + 1 && range.upper >= existing.lower - 1) {
            // Merge them
            const oldLower = existing.lower;
            const oldUpper = existing.upper;
            existing.lower = Math.min(existing.lower, range.lower);
            existing.upper = Math.max(existing.upper, range.upper);
            
            // Animate the merge
            await this.animateMerge(range, existing, oldLower, oldUpper, iteration);
            
            merged = true;
            changed = true;
            break;
          }
        }
        
        if (!merged) {
          newRanges.push({ ...range });
        }
      }
      
      this.currentRanges = newRanges;
      iteration++;
      
      if (changed) {
        await this.delay(PART2_CONFIG.MERGE_ITERATION_DELAY_MS);
      }
    }
  }
  
  async animateMerge(range1, mergedRange, oldLower, oldUpper, iteration) {
    // Find existing eggplants
    const eggplants = Array.from(this.rulerContainer.querySelectorAll('[data-id]'));
    
    // Highlight the ranges being merged
    const e1 = eggplants.find(e => 
      parseInt(e.dataset.lower) === range1.lower && 
      parseInt(e.dataset.upper) === range1.upper
    );
    const e2 = eggplants.find(e => 
      parseInt(e.dataset.lower) === oldLower && 
      parseInt(e.dataset.upper) === oldUpper
    );
    
    if (e1 && e2) {
      // Highlight
      e1.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.8)';
      e2.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.8)';
      
      await this.delay(PART2_CONFIG.MERGE_HIGHLIGHT_DELAY_MS);
      
      // Create merged eggplant
      const y = 120 + (iteration % 3) * 80;
      const merged = createEggplant(mergedRange, y, `merged-${iteration}-${Date.now()}`, this.scale, this.minValue);
      merged.style.opacity = '0';
      merged.style.transform = 'scale(0.5)';
      this.rulerContainer.appendChild(merged);
      
      // Fade out old eggplants
      e1.style.opacity = '0';
      e1.style.transform = 'scale(0.8)';
      e2.style.opacity = '0';
      e2.style.transform = 'scale(0.8)';
      
      // Fade in merged eggplant
      setTimeout(() => {
        merged.style.opacity = '1';
        merged.style.transform = 'scale(1)';
      }, PART2_CONFIG.MERGED_FADE_IN_DELAY_MS);
      
      await this.delay(PART2_CONFIG.MERGE_ANIMATION_DELAY_MS);
      
      // Remove old eggplants
      e1.remove();
      e2.remove();
    }
  }
  
  async removeContainedRanges() {
    this.statusDisplay.textContent = 'Removing contained ranges...';
    
    const toRemove = [];
    
    for (let i = 0; i < this.currentRanges.length; i++) {
      for (let j = 0; j < this.currentRanges.length; j++) {
        if (i !== j) {
          const r1 = this.currentRanges[i];
          const r2 = this.currentRanges[j];
          
          // Check if r1 is contained within r2
          if (r1.lower >= r2.lower && r1.upper <= r2.upper) {
            if (!toRemove.includes(i)) {
              toRemove.push(i);
              
              // Animate removal
              const eggplants = Array.from(this.rulerContainer.querySelectorAll('[data-id]'));
              const e = eggplants.find(el => 
                parseInt(el.dataset.lower) === r1.lower && 
                parseInt(el.dataset.upper) === r1.upper
              );
              
              if (e) {
                e.style.opacity = '0';
                e.style.transform = 'scale(0.5)';
                await this.delay(PART2_CONFIG.REMOVE_CONTAINED_DELAY_MS);
                e.remove();
              }
            }
          }
        }
      }
    }
    
    // Remove from array
    this.currentRanges = this.currentRanges.filter((_, i) => !toRemove.includes(i));
  }
  
  calculateTotal() {
    let total = 0;
    for (const range of this.currentRanges) {
      total += range.upper - range.lower + 1;
    }
    return total;
  }
  
  async animateCountingValues() {
    this.statusDisplay.textContent = 'Counting all values in merged ranges...';
    
    // Reset counter
    if (this.counterBox) {
      this.counterBox.setValue(0);
    }
    
    let totalCount = 0;
    
    // Count through each range
    for (const range of this.currentRanges) {
      // Find the eggplant for this range
      const eggplants = Array.from(this.rulerContainer.querySelectorAll('[data-id]'));
      const eggplant = eggplants.find(e => 
        parseInt(e.dataset.lower) === range.lower && 
        parseInt(e.dataset.upper) === range.upper
      );
      
      if (eggplant) {
        // Highlight the eggplant being counted
        eggplant.style.boxShadow = '0 8px 20px rgba(81, 207, 102, 0.8)';
        eggplant.style.transform = 'scale(1.05)';
      }
      
      // Count each value in the range
      for (let val = range.lower; val <= range.upper; val++) {
        const x = (val - this.minValue) * this.scale;
        
        // Create a counting marker
        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          left: ${50 + x}px;
          bottom: 100px;
          width: 3px;
          height: 30px;
          background: #51cf66;
          animation: countPulse 0.3s ease;
          z-index: 20;
        `;
        this.rulerContainer.appendChild(marker);
        
        // Increment counter
        totalCount++;
        if (this.counterBox) {
          this.counterBox.setValue(totalCount);
        }
        
        // Play ding sound
        audioManager.play('ding', 0.3);
        
        // Remove marker after animation
        setTimeout(() => marker.remove(), PART2_CONFIG.MARKER_FADE_DELAY_MS);
        
        // Delay between counts
        await this.delay(PART2_CONFIG.COUNT_VALUE_DELAY_MS);
      }
      
      if (eggplant) {
        // Reset eggplant highlight
        eggplant.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        eggplant.style.transform = 'scale(1)';
      }
      
      await this.delay(PART2_CONFIG.COUNT_COMPLETE_DELAY_MS);
    }
    
    return totalCount;
  }
  
  async animate() {
    // Show initial ranges
    await this.showInitialRanges();
    
    await this.delay(PART2_CONFIG.PHASE_TRANSITION_DELAY_MS);
    
    // Merge ranges
    await this.mergeRanges();
    
    await this.delay(PART2_CONFIG.PHASE_TRANSITION_DELAY_MS);
    
    // Remove contained ranges
    await this.removeContainedRanges();
    
    await this.delay(PART2_CONFIG.PHASE_TRANSITION_DELAY_MS);
    
    // Animate counting all values
    const total = await this.animateCountingValues();
    
    this.statusDisplay.textContent = `Final merged ranges: ${this.currentRanges.length} ranges covering ${total} values`;
    this.statusDisplay.style.color = '#27ae60';
    this.statusDisplay.style.fontWeight = 'bold';
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  cleanup() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Add CSS animations
if (!document.getElementById('merging-eggplants-animation')) {
  const style = document.createElement('style');
  style.id = 'merging-eggplants-animation';
  style.textContent = `
    @keyframes countPulse {
      0% { 
        transform: scaleY(0);
        opacity: 0;
      }
      50% { 
        transform: scaleY(1.2);
        opacity: 1;
      }
      100% { 
        transform: scaleY(1);
        opacity: 0.8;
      }
    }
  `;
  document.head.appendChild(style);
}

