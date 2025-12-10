// Common utilities for Day 9 visualizations
import { COMMON_CONFIG, CANVAS_STYLE, GRID_STYLE } from './config.js';

export class GridRenderer {
    constructor(container, width, height, cellSize = 20) {
        this.container = container;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.canvas = null;
        this.ctx = null;
        this.snowflakes = [];
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
        this.canvas.style.border = `${CANVAS_STYLE.BORDER_WIDTH} solid ${CANVAS_STYLE.BORDER_COLOR}`;
        this.canvas.style.borderRadius = CANVAS_STYLE.BORDER_RADIUS;
        this.canvas.style.boxShadow = CANVAS_STYLE.BOX_SHADOW;
        this.canvas.style.background = CANVAS_STYLE.BACKGROUND_COLOR;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.top = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Initialize snowflakes for festive effect
        for (let i = 0; i < COMMON_CONFIG.SNOWFLAKE_COUNT; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * (COMMON_CONFIG.SNOWFLAKE_MAX_RADIUS - COMMON_CONFIG.SNOWFLAKE_MIN_RADIUS) + COMMON_CONFIG.SNOWFLAKE_MIN_RADIUS,
                speed: Math.random() * (COMMON_CONFIG.SNOWFLAKE_MAX_SPEED - COMMON_CONFIG.SNOWFLAKE_MIN_SPEED) + COMMON_CONFIG.SNOWFLAKE_MIN_SPEED,
                drift: Math.random() * COMMON_CONFIG.SNOWFLAKE_MAX_DRIFT - COMMON_CONFIG.SNOWFLAKE_MAX_DRIFT / 2
            });
        }
    }

    drawSnowflakes() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.snowflakes.forEach(flake => {
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Update position
            flake.y += flake.speed;
            flake.x += flake.drift;

            // Reset if off screen
            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }
            if (flake.x < 0 || flake.x > this.canvas.width) {
                flake.x = Math.random() * this.canvas.width;
            }
        });
    }

    drawGrid() {
        this.ctx.strokeStyle = GRID_STYLE.LINE_COLOR;
        this.ctx.lineWidth = GRID_STYLE.LINE_WIDTH;

        // Draw vertical lines
        for (let x = 0; x <= this.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= this.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    drawPoint(x, y, color = '#ff6b6b', emoji = '🎁') {
        const cx = x * this.cellSize + this.cellSize / 2;
        const cy = y * this.cellSize + this.cellSize / 2;

        // Draw glow
        const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, this.cellSize);
        gradient.addColorStop(0, color + 'aa');
        gradient.addColorStop(1, color + '00');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            x * this.cellSize - this.cellSize / 2,
            y * this.cellSize - this.cellSize / 2,
            this.cellSize * 2,
            this.cellSize * 2
        );

        // Draw emoji
        this.ctx.font = `${this.cellSize * 0.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(emoji, cx, cy);
    }

    drawRectangle(x1, y1, x2, y2, color = 'rgba(255, 215, 0, 0.3)', strokeColor = '#ffd700') {
        const minX = Math.min(x1, x2);
        const minY = Math.min(y1, y2);
        const maxX = Math.max(x1, x2);
        const maxY = Math.max(y1, y2);

        // Fill
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            minX * this.cellSize,
            minY * this.cellSize,
            (maxX - minX + 1) * this.cellSize,
            (maxY - minY + 1) * this.cellSize
        );

        // Stroke with festive pattern
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = GRID_STYLE.STROKE_WIDTH;
        this.ctx.setLineDash(GRID_STYLE.DASH_PATTERN);
        this.ctx.strokeRect(
            minX * this.cellSize,
            minY * this.cellSize,
            (maxX - minX + 1) * this.cellSize,
            (maxY - minY + 1) * this.cellSize
        );
        this.ctx.setLineDash([]);
    }

    drawPulsingRectangle(x1, y1, x2, y2, frame, baseColor = COLORS.GREEN) {
        // Create pulsing effect
        const scale = 1 + Math.sin(frame * COMMON_CONFIG.PULSE_SPEED) * COMMON_CONFIG.PULSE_SCALE_AMPLITUDE;
        
        // Calculate center and scaled dimensions
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const width = Math.abs(x2 - x1) + 1;
        const height = Math.abs(y2 - y1) + 1;
        
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        
        const scaledX1 = centerX - scaledWidth / 2;
        const scaledY1 = centerY - scaledHeight / 2;
        const scaledX2 = centerX + scaledWidth / 2;
        const scaledY2 = centerY + scaledHeight / 2;
        
        // Draw pulsing rectangle with varying alpha
        const alpha = COMMON_CONFIG.PULSE_ALPHA_BASE + Math.sin(frame * COMMON_CONFIG.PULSE_SPEED) * COMMON_CONFIG.PULSE_ALPHA_AMPLITUDE;
        this.drawRectangle(
            scaledX1, scaledY1, scaledX2, scaledY2,
            `rgba(76, 175, 80, ${alpha})`,
            baseColor
        );
    }

    drawFilledArea(grid, width, height, fillColor = 'rgba(76, 175, 80, 0.4)') {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Only draw interior fill (3), not boundary lines (2)
                if (grid[y] && grid[y][x] === 3) {
                    this.ctx.fillStyle = fillColor;
                    this.ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
    }

    drawBoundary(grid, width, height, redColor = '#ff6b6b', greenColor = '#4caf50') {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y] && grid[y][x] === 1) { // Red corner
                    this.ctx.fillStyle = redColor;
                    this.ctx.fillRect(
                        x * this.cellSize + 2,
                        y * this.cellSize + 2,
                        this.cellSize - 4,
                        this.cellSize - 4
                    );
                } else if (grid[y] && grid[y][x] === 2) { // Green boundary line
                    this.ctx.fillStyle = greenColor;
                    this.ctx.fillRect(
                        x * this.cellSize + 2,
                        y * this.cellSize + 2,
                        this.cellSize - 4,
                        this.cellSize - 4
                    );
                }
            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    cleanup() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

export function parseInput(lines) {
    return lines.map(line => {
        const [x, y] = line.split(',').map(Number);
        return { x, y };
    });
}

export function calculateArea(p1, p2) {
    return (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1);
}

export function getGridBounds(points) {
    let maxX = 0, maxY = 0;
    points.forEach(p => {
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
    });
    return { maxX, maxY };
}

// Festive color palette
export const COLORS = {
    RED: '#ff6b6b',
    GREEN: '#4caf50',
    GOLD: '#ffd700',
    BLUE: '#2196f3',
    PURPLE: '#9c27b0',
    SNOW: '#ffffff'
};

// Festive emojis
export const EMOJIS = {
    GIFT: '🎁',
    STAR: '⭐',
    TREE: '🎄',
    SNOWFLAKE: '❄️',
    CANDY: '🍬',
    BELL: '🔔'
};
