# 🎄 AOC Visualizations How-To Guide 🎄

A comprehensive guide to creating festive, reusable visualizations for Advent of Code challenges.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Reusable Components](#reusable-components)
3. [Utilities](#utilities)
4. [Creating a New Visualization](#creating-a-new-visualization)
5. [Where to Be Creative & Festive](#where-to-be-creative--festive)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Quick Start

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build
```

### File Structure

```
visuals/src/
├── components/
│   ├── counter-box.js         # Reusable counter display
│   ├── day-title.js           # Day/part title header
│   ├── instruction-panel.js   # Instructions display
│   ├── gift-buttons.js        # Main UI buttons
│   └── visualizations/
│       └── dayX/
│           ├── part1.js       # Part 1 visualization
│           ├── part2.js       # Part 2 visualization
│           └── custom.js      # Custom components
├── utils/
│   ├── audio.js               # Audio management
│   ├── celebration.js         # Fireworks & celebrations
│   └── colors.js              # Color palettes
├── assets/
│   └── sounds/                # Audio files
└── styles/                    # CSS files
```

---

## Reusable Components

### 1. **DayTitle** - Day/Part Header

**Purpose**: Display "Day X, Part Y" with festive animated styling.

**Usage**:
```javascript
import { DayTitle } from '../../day-title.js';

const dayTitle = new DayTitle(container, dayNumber, partNumber);

// Cleanup when done
dayTitle.cleanup();
```

**Features**:
- Animated gradient text (red → green → gold)
- Festive glow effects
- Auto-positioned at top center
- Christmas tree emojis 🎄

**When to use**: ⚠️ **REQUIRED** - Every visualization MUST have this!

---

### 2. **CounterBox** - Animated Counter Display

**Purpose**: Display and update a counter with festive candy-cane border.

**Usage**:
```javascript
import { CounterBox } from '../../counter-box.js';

const counter = new CounterBox(container, 'Label Text');

// Update counter
counter.setValue(42);
counter.increment(1);

// Mark as complete (turns green)
counter.markComplete();

// Cleanup
counter.cleanup();
```

**Features**:
- Animated candy-cane striped border
- Red gradient background
- Gold glowing text
- Pulse animation
- Positioned at top-right by default

**When to use**: ⚠️ **REQUIRED** - Every visualization MUST have this! Always track something (count, score, steps, etc.)

---

### 3. **InstructionPanel** - Instructions Display

**Purpose**: Show instructions or problem description to the user.

**Usage**:
```javascript
import { InstructionPanel } from '../../instruction-panel.js';

const instructions = new InstructionPanel(
  container, 
  'Count how many values fall within the ranges'
);

// Cleanup
instructions.cleanup();
```

**Features**:
- Green candy-cane border
- Green gradient background
- Positioned at top-left by default
- Christmas tree emojis 🎄

**When to use**: ⚠️ **REQUIRED** - Every visualization MUST have this! Always explain what the visualization is doing.

---

## Utilities

### 1. **Audio Manager** - Sound Effects

**Purpose**: Load and play sound effects with volume control.

**Usage**:
```javascript
import { audioManager } from '../../../utils/audio.js';

// Load sounds (do this once)
await audioManager.loadSound('click', 'click.mp3');
await audioManager.loadSound('ding', 'ding.mp3');

// Play sounds
audioManager.play('click', 0.5);  // volume 0.0-1.0
audioManager.play('ding');        // default volume 1.0

// Control
audioManager.stopAll();
audioManager.setEffectsVolume(0.7);
audioManager.setEnabled(false);
```

**Available Sounds**:
- `click.mp3` - UI clicks
- `ding.mp3` - Success/hit sound
- `energy.mp3` - Power-up sound
- `explosion.mp3` - Explosion effect
- `log-split.mp3` - Splitting/breaking sound
- `yay.mp3` - Celebration sound
- `music.mp3` - Background music

**When to use**: Add audio feedback for user actions and events.

---

### 2. **Celebration** - Fireworks & Effects

**Purpose**: Trigger celebratory fireworks, snowflakes, and flying emojis.

**Usage**:
```javascript
import { celebrate, loadCelebrationAssets } from '../../../utils/celebration.js';

// Load assets (call once at startup)
await loadCelebrationAssets();

// Trigger celebration
const fireworks = celebrate(container, 5000); // duration in ms

// Cleanup
fireworks.cleanup();
```

**Features**:
- Colorful fireworks explosions
- Falling snowflakes that accumulate
- Flying Christmas emojis (🎄🎅🎁⭐❄️☃️🔔🦌)
- Plays celebration sound automatically

**When to use**: When visualization completes successfully!

---

### 3. **Colors** - Christmas Color Palettes

**Purpose**: Provide festive color schemes for boxes and ribbons.

**Usage**:
```javascript
import { boxColors, ribbonColors, getRandomColor, getContrastingRibbon } from '../../../utils/colors.js';

// Get random colors
const boxColor = getRandomColor(boxColors);
const ribbonColor = getContrastingRibbon(boxColor);
```

**Available Palettes**:
- **Box Colors**: Red, green, blue, orange, purple, turquoise
- **Ribbon Colors**: Gold, yellow, pink, royal blue, lime green

**When to use**: For custom components that need festive colors.

---

## Creating a New Visualization

> ⚠️ **IMPORTANT**: Every visualization MUST include these three components:
> 1. **DayTitle** - Shows "Day X, Part Y" at the top
> 2. **CounterBox** - Tracks a count/score (always find something to count!)
> 3. **InstructionPanel** - Explains what the visualization does
>
> These are NOT optional - they provide consistency and help users understand what's happening!

### Step 1: Create the File Structure

```bash
mkdir -p src/components/visualizations/dayX
touch src/components/visualizations/dayX/part1.js
touch src/components/visualizations/dayX/part2.js
```

### Step 2: Basic Template

```javascript
import { DayTitle } from '../../day-title.js';
import { CounterBox } from '../../counter-box.js';
import { InstructionPanel } from '../../instruction-panel.js';
import { celebrate } from '../../../utils/celebration.js';
import { audioManager } from '../../../utils/audio.js';

/**
 * Day X Part Y visualization
 */
export default function visualize(container, onComplete) {
  // 1. Setup instruction text
  const instructionText = 'Your instructions here';
  
  // 2. Parse your input data
  const data = [/* your test data */];
  
  // 3. Create reusable components
  const dayTitle = new DayTitle(container, X, Y);
  const counter = new CounterBox(container, 'Counter Label');
  const instructions = new InstructionPanel(container, instructionText);
  
  // 4. Create custom visualization elements
  const customElement = createCustomVisualization(container, data);
  
  // 5. Track fireworks for cleanup
  let fireworks = null;
  
  // 6. Animate your visualization
  setTimeout(async () => {
    // Your animation logic here
    await animateVisualization(data, counter);
    
    // 7. Check if answer is correct, then celebrate!
    setTimeout(() => {
      // Define the expected answer for this visualization
      const expectedAnswer = 42; // Replace with your expected answer
      const isCorrect = counter.counterValue === expectedAnswer;
      
      // Only celebrate if the answer is correct
      if (isCorrect) {
        counter.markComplete(); // Turn counter green
        fireworks = celebrate(container, 5000); // Trigger fireworks
        
        // Play celebration sound
        setTimeout(() => {
          audioManager.play('yay', 0.8);
        }, 500);
      }
      
      // 8. Notify completion (closes gift box)
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    }, 1000);
  }, 1000);
  
  // 9. Return cleanup function
  return {
    cleanup: () => {
      dayTitle.cleanup();
      counter.cleanup();
      instructions.cleanup();
      // Clean up custom elements
      if (fireworks) {
        fireworks.cleanup();
      }
    }
  };
}
```

### Step 3: Key Patterns

#### Animation Timing
```javascript
// Use setTimeout for sequential animations
setTimeout(() => {
  // First action
}, 1000);

setTimeout(() => {
  // Second action
}, 2000);

// Or use delays in loops
items.forEach((item, index) => {
  setTimeout(() => {
    animateItem(item);
  }, index * 500); // 500ms between each
});
```

#### Audio Feedback
```javascript
// Load sounds at start
audioManager.loadSound('ding', 'ding.mp3');

// Play on events
element.addEventListener('click', () => {
  audioManager.play('ding', 0.6);
});
```

#### Counter Updates
```javascript
// Increment on each success
if (condition) {
  counter.increment(1);
  audioManager.play('ding', 0.6);
}
```

#### Conditional Celebrations (IMPORTANT!)

**Always verify the answer before celebrating!** This helps catch bugs and provides clear visual feedback.

```javascript
// After animation completes, check the answer
setTimeout(() => {
  // Define expected answer from your test input
  const expectedAnswer = 21; // Get this from your Go solution
  const isCorrect = counter.counterValue === expectedAnswer;
  
  // Only celebrate if correct
  if (isCorrect) {
    counter.markComplete();           // Turn green
    fireworks = celebrate(container); // Fireworks
    audioManager.play('yay', 0.8);   // Success sound
  }
  // If incorrect: counter stays red, no fireworks, no sound
  
  if (onComplete) {
    setTimeout(onComplete, 2000);
  }
}, 1000);
```

**Why this matters:**
- ✅ Green counter = correct answer
- ❌ Red counter = bug in visualization
- Immediate visual feedback during development
- Prevents false celebrations

---

## Where to Be Creative & Festive

### 🎨 **REUSE These** (Don't Reinvent)

1. **DayTitle** - Always use this for consistency
2. **CounterBox** - For any counting/scoring
3. **InstructionPanel** - For showing instructions
4. **Celebration effects** - Use `celebrate()` at the end
5. **Audio manager** - For all sound effects
6. **Color palettes** - Use provided Christmas colors

### ✨ **BE CREATIVE Here**

1. **Custom Visualization Components**
   - Create problem-specific visual elements
   - Example: Safe dial, eggplant ruler, wooden ruler
   - Make them festive with Christmas themes!

2. **Animation Styles**
   - Rotation, scaling, sliding effects
   - Particle effects
   - Emoji animations
   - Snow, sparkles, stars

3. **Festive Decorations**
   - Add Christmas emojis: 🎄🎅🎁⭐❄️☃️🔔🦌🧦🍪
   - Use candy-cane patterns
   - Add twinkling lights
   - Snowflake overlays

4. **Interactive Elements**
   - Clickable objects
   - Hover effects
   - Drag-and-drop
   - Button interactions

5. **Custom Sounds**
   - Add new sound files to `assets/sounds/`
   - Load them with `audioManager.loadSound()`
   - Play at appropriate moments

6. **Thematic Elements**
   - Match visualization to problem theme
   - Add seasonal decorations
   - Use festive color schemes
   - Include holiday-themed graphics

### 🎄 **Festive Ideas**

- **Snowfall**: Add falling snowflakes during animations
- **Twinkling stars**: Animate star emojis ⭐✨
- **Santa's sleigh**: Flying across screen 🎅🦌
- **Gift boxes**: Wrap elements in gift box styling 🎁
- **Christmas lights**: Blinking colored dots
- **Candy canes**: Striped borders and patterns 🍬
- **Gingerbread**: Cookie-themed elements 🍪
- **Ornaments**: Hanging decorations
- **Wreaths**: Circular decorative frames
- **Bells**: Ringing animations 🔔

---

## Best Practices

### 1. **Always Clean Up**

```javascript
return {
  cleanup: () => {
    // Remove all DOM elements
    dayTitle.cleanup();
    counter.cleanup();
    
    // Clear timers
    clearTimeout(timerId);
    clearInterval(intervalId);
    
    // Stop animations
    cancelAnimationFrame(frameId);
    
    // Stop audio
    audioManager.stopAll();
    
    // Remove event listeners
    element.removeEventListener('click', handler);
  }
};
```

### 2. **Use Test Data**

- Always use the test input from `input-test.txt`
- Keep visualizations short and sweet (5-10 seconds)
- Don't try to visualize full input (too slow)

### 3. **Timing Guidelines**

- Initial delay: 500-1000ms
- Between steps: 200-500ms
- Animation duration: 300-800ms
- Total visualization: 5-15 seconds
- Celebration: 5000ms (5 seconds)

### 4. **Accessibility**

- Use high contrast colors
- Add text labels
- Provide audio feedback
- Keep animations smooth (60fps)

### 5. **Performance**

- Use `requestAnimationFrame` for smooth animations
- Limit particle counts (< 100 active particles)
- Clean up unused DOM elements
- Reuse objects instead of creating new ones

### 6. **Responsive Design**

```javascript
// Use container dimensions
const width = container.clientWidth;
const height = container.clientHeight;

// Position relative to container
element.style.left = `${width * 0.5}px`;
element.style.top = `${height * 0.3}px`;
```

---

## Examples

### Example 1: Simple Counter Visualization

```javascript
export default function visualize(container, onComplete) {
  const dayTitle = new DayTitle(container, 1, 1);
  const counter = new CounterBox(container, 'Items Found');
  let fireworks = null;
  
  const items = [1, 2, 3, 4, 5];
  
  items.forEach((item, index) => {
    setTimeout(() => {
      counter.increment(1);
      audioManager.play('ding', 0.5);
      
      if (index === items.length - 1) {
        setTimeout(() => {
          counter.markComplete();
          fireworks = celebrate(container);
          if (onComplete) onComplete();
        }, 500);
      }
    }, index * 1000);
  });
  
  return {
    cleanup: () => {
      dayTitle.cleanup();
      counter.cleanup();
      if (fireworks) fireworks.cleanup();
    }
  };
}
```

### Example 2: Custom Animated Element

```javascript
function createSnowman(container) {
  const snowman = document.createElement('div');
  snowman.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 100px;
    animation: bounce 1s ease-in-out infinite;
  `;
  snowman.textContent = '⛄';
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -60%) scale(1.1); }
    }
  `;
  document.head.appendChild(style);
  
  container.appendChild(snowman);
  
  return {
    element: snowman,
    cleanup: () => {
      if (snowman.parentNode) {
        snowman.parentNode.removeChild(snowman);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  };
}
```

### Example 3: Canvas-Based Animation

```javascript
function createCanvasAnimation(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
  `;
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let animationId = null;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw your animation here
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  return {
    canvas,
    cleanup: () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };
}
```

---

## Tips & Tricks

### 1. **Debugging**

```javascript
// Add console logs
console.log('Animation step:', step);

// Visual debugging
element.style.border = '2px solid red';

// Check timing
console.time('animation');
// ... animation code ...
console.timeEnd('animation');
```

### 2. **Smooth Animations**

```javascript
// Use CSS transitions
element.style.transition = 'all 0.5s ease-in-out';
element.style.transform = 'translateX(100px)';

// Or use requestAnimationFrame
function smoothMove(element, targetX, duration) {
  const startX = element.offsetLeft;
  const startTime = Date.now();
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    
    element.style.left = `${startX + (targetX - startX) * eased}px`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}
```

### 3. **Random Festive Elements**

```javascript
const festiveEmojis = ['🎄', '🎅', '🎁', '⭐', '❄️', '☃️'];

function addRandomEmoji(container) {
  const emoji = document.createElement('div');
  emoji.textContent = festiveEmojis[Math.floor(Math.random() * festiveEmojis.length)];
  emoji.style.cssText = `
    position: absolute;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    font-size: ${20 + Math.random() * 30}px;
    animation: twinkle 2s ease-in-out infinite;
  `;
  container.appendChild(emoji);
  return emoji;
}
```

---

## Checklist for New Visualizations

- [ ] Created `dayX/part1.js` and `dayX/part2.js` files
- [ ] ⚠️ **REQUIRED**: Imported and used `DayTitle` component
- [ ] ⚠️ **REQUIRED**: Added `CounterBox` (always track something!)
- [ ] ⚠️ **REQUIRED**: Added `InstructionPanel` (always explain what's happening!)
- [ ] Used test input data (not full input)
- [ ] Added audio feedback with `audioManager`
- [ ] Included festive elements (emojis, colors, animations)
- [ ] Called `celebrate()` when complete
- [ ] Called `onComplete()` callback at the end
- [ ] Implemented proper `cleanup()` function
- [ ] Tested visualization runs smoothly
- [ ] Kept total duration under 15 seconds
- [ ] Added Christmas theme/decorations

---

## Getting Help

- Check existing visualizations in `src/components/visualizations/`
- Look at `day1/part1.js` for a simple example
- Look at `day5/part1.js` for component usage
- Review component source code for advanced features
- Test frequently with `npm run dev`

---

## 🎄 Happy Coding! 🎄

Remember: **Reuse the components, but make your visualization uniquely festive!**
