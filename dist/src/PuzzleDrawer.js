"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawPuzzleStars = exports.drawPuzzleRegionBorders = exports.drawPuzzleRegionBackgrounds = exports.drawPuzzleGrid = exports.drawPuzzle = void 0;
const assert_1 = __importDefault(require("assert"));
/**
 * Draws the state of a puzzle onto a canvas, using the canvas's width and height.
 * The grid is drawn with 1px grey border on the closest pixel position on the canvas
 * to make the grid lines evenly spaced.
 * Each region is drawn with a random color of background.
 * Each star is drawn within each cell.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzle(canvas, puzzle) {
    // just glue code, no need to test
    drawPuzzleRegionBackgrounds(canvas, puzzle);
    drawPuzzleGrid(canvas, puzzle);
    drawPuzzleStars(canvas, puzzle);
    drawPuzzleRegionBorders(canvas, puzzle);
}
exports.drawPuzzle = drawPuzzle;
/**
 * Draws a grid of the puzzle onto a canvas, using the canvas's width and height.
 * More precisely, the grid is drawn with 1px grey (#555555) border on the closest pixel position
 * on the canvas to make the grid lines evenly spaced.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzleGrid(canvas, puzzle) {
    const FILL_COLOR = "#555555";
    const context = canvas.getContext("2d") ?? assert_1.default.fail("null context");
    context.fillStyle = FILL_COLOR;
    for (let x = 0; x <= puzzle.cols; x += 1) {
        const canvasX = Math.round((canvas.width - 1) * x / puzzle.cols);
        context.fillRect(canvasX, 0, 1, canvas.height);
    }
    for (let y = 0; y <= puzzle.rows; y += 1) {
        const canvasY = Math.round((canvas.height - 1) * y / puzzle.rows);
        context.fillRect(0, canvasY, canvas.width, 1);
    }
}
exports.drawPuzzleGrid = drawPuzzleGrid;
/**
 * Draws the regions of the puzzle onto a canvas, using the canvas's width and height.
 * Each region is assigned a random color with 75% lightness,
 * and the backgrounds of each square cell in each region are colored this color.
 * The bounds of the square cells are determined to make each square cell have as close to identical
 * width and height as possible.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzleRegionBackgrounds(canvas, puzzle) {
    /**
     * @returns hex string of a random HSL color.
     */
    function getRandomColor() {
        const degrees = 360;
        const lightness = 75;
        const percent = 100;
        return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 100)}%, ${lightness}%)`;
    }
    const context = canvas.getContext("2d") ?? assert_1.default.fail("null context");
    const regionColors = new Map();
    for (let x = 0; x < puzzle.cols; x += 1) {
        for (let y = 0; y < puzzle.rows; y += 1) {
            const squareLeft = Math.round((canvas.width) * x / puzzle.cols);
            const squareRight = Math.round((canvas.width) * (x + 1) / puzzle.cols);
            const squareTop = Math.round((canvas.height) * y / puzzle.rows);
            const squareBottom = Math.round((canvas.height) * (y + 1) / puzzle.rows);
            const regionId = puzzle.getCell({ col: x, row: y }).regionId;
            const regionColor = regionColors.get(regionId) ?? getRandomColor();
            regionColors.set(regionId, regionColor);
            context.fillStyle = regionColor;
            context.fillRect(squareLeft, squareTop, squareRight - squareLeft, squareBottom - squareTop);
        }
    }
}
exports.drawPuzzleRegionBackgrounds = drawPuzzleRegionBackgrounds;
/**
 * Draws border around the regions of the puzzle.
 * Each border is 3 units wide and black in color.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzleRegionBorders(canvas, puzzle) {
    const context = canvas.getContext('2d') ?? assert_1.default.fail('null context');
    context.save();
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.beginPath();
    // check the cells (i, j) and (i - 1, j), if they are not 
    // from the same region, then add a horizontal border between them
    for (let i = 1; i < puzzle.rows; i++) {
        for (let j = 0; j < puzzle.cols; j++) {
            const startX = j * canvas.width / puzzle.cols;
            const endX = (j + 1) * canvas.width / puzzle.cols;
            const y = i * canvas.height / puzzle.rows;
            if (puzzle.getCell({ row: i - 1, col: j }).regionId !== puzzle.getCell({ row: i, col: j }).regionId) {
                context.moveTo(startX, y);
                context.lineTo(endX, y);
            }
        }
    }
    // check the cells (i, j) and (i, j - 1), if they are not 
    // from the same region, then add a vertical border between them
    for (let i = 0; i < puzzle.rows; i++) {
        for (let j = 1; j < puzzle.cols; j++) {
            const x = j * canvas.width / puzzle.cols;
            const startY = i * canvas.height / puzzle.rows;
            const endY = (i + 1) * canvas.height / puzzle.rows;
            if (puzzle.getCell({ row: i, col: j - 1 }).regionId !== puzzle.getCell({ row: i, col: j }).regionId) {
                context.moveTo(x, startY);
                context.lineTo(x, endY);
            }
        }
    }
    // add borders around the whole puzzle
    context.moveTo(0, 0);
    context.lineTo(0, canvas.height);
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(canvas.width, 0);
    context.lineTo(0, 0);
    context.stroke();
    context.restore();
}
exports.drawPuzzleRegionBorders = drawPuzzleRegionBorders;
/**
 * Draws the stars of the puzzle onto a canvas, using canvas's width and height.
 * The star icon is drawn with black color and will cover the center pixel of each square cell.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn upon.
 */
function drawPuzzleStars(canvas, puzzle) {
    const context = canvas.getContext("2d") ?? assert_1.default.fail("null context");
    context.fillStyle = "#000000";
    /**
     * Draws a star symbol at the specified location and with the specified size.
     *
     * @param left the left bound of the star symbol, positive integer
     * @param top the top bound of the star symbol, positive integer
     * @param width the width the star symbol occupies, positive integer
     * @param height the height the star symbol occupies, positive integer
     */
    function drawStar(left, top, width, height) {
        const MIDDLE = 0.5;
        const MAJOR_LENGTH = 0.4;
        const MINOR_LENGTH = 0.15;
        const starPaths = [
            [[MIDDLE, MIDDLE - MAJOR_LENGTH], [MIDDLE - MINOR_LENGTH, MIDDLE]],
            [[MIDDLE + MAJOR_LENGTH, MIDDLE], [MIDDLE, MIDDLE - MINOR_LENGTH]],
            [[MIDDLE, MIDDLE + MAJOR_LENGTH], [MIDDLE + MINOR_LENGTH, MIDDLE]],
            [[MIDDLE - MAJOR_LENGTH, MIDDLE], [MIDDLE, MIDDLE + MINOR_LENGTH]],
        ];
        const relativeToAbsoluteX = (x) => Math.round(left + width * x);
        const relativeToAbsoluteY = (y) => Math.round(top + height * y);
        for (const polygon of starPaths) {
            context.beginPath();
            context.moveTo(relativeToAbsoluteX(MIDDLE), relativeToAbsoluteY(MIDDLE));
            for (const position of polygon) {
                context.lineTo(relativeToAbsoluteX(position[0]), relativeToAbsoluteY(position[1]));
            }
            context.closePath();
            context.fill();
        }
    }
    for (let x = 0; x < puzzle.cols; x += 1) {
        for (let y = 0; y < puzzle.rows; y += 1) {
            const squareLeft = Math.round((canvas.width) * x / puzzle.cols);
            const squareRight = Math.round((canvas.width) * (x + 1) / puzzle.cols);
            const squareTop = Math.round((canvas.height) * y / puzzle.rows);
            const squareBottom = Math.round((canvas.height) * (y + 1) / puzzle.rows);
            if (puzzle.getCell({ col: x, row: y }).containsStar) {
                drawStar(squareLeft, squareTop, squareRight - squareLeft, squareBottom - squareTop);
            }
        }
    }
}
exports.drawPuzzleStars = drawPuzzleStars;
//# sourceMappingURL=PuzzleDrawer.js.map