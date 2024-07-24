import {Position, Puzzle} from "./Puzzle";
// import only the types from 'canvas', not the implementations
import type { Canvas, CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from 'canvas';
import assert from "assert";

/**
 * Either: a CanvasRenderingContext2D in the web browser,
 *      or a NodeCanvasRenderingContext2D in Node (for testing)
 */
type WebOrNodeCanvasRenderingContext2D = CanvasRenderingContext2D | NodeCanvasRenderingContext2D;

/**
 * Either: a HTMLCanvasElement representing a `<canvas>` on the web page,
 *      or a Canvas representing a canvas in Node (for testing)
 */
type WebOrNodeCanvas = Omit<HTMLCanvasElement | Canvas, 'getContext'> & {
    getContext(contextId: '2d'): WebOrNodeCanvasRenderingContext2D | null;
};


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
export function drawPuzzle(canvas: WebOrNodeCanvas, puzzle: Puzzle): void {
    // just glue code, no need to test
    drawPuzzleRegionBackgrounds(canvas, puzzle);
    drawPuzzleGrid(canvas, puzzle);
    drawPuzzleRegionBorders(canvas, puzzle);
    drawPuzzleStars(canvas, puzzle);
}

/**
 * Draws a grid of the puzzle onto a canvas, using the canvas's width and height.
 * More precisely, the grid is drawn with 1px grey (#555555) border on the closest pixel position
 * on the canvas to make the grid lines evenly spaced.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
export function drawPuzzleGrid(canvas: WebOrNodeCanvas, puzzle: Puzzle): void {
    const FILL_COLOR = "#555555";
    const context = canvas.getContext("2d") ?? assert.fail("null context");
    context.save(); // save current context state to not mutate it as it appears to an outside observer.
    context.fillStyle = FILL_COLOR;
    for (let x = 0; x <= puzzle.cols; x += 1) {
        // without subtracting 1, the last line would not be drawn within the canvas
        const canvasX = Math.round((canvas.width - 1) * x / puzzle.cols);
        context.fillRect(canvasX, 0, 1, canvas.height);
    }
    for (let y = 0; y <= puzzle.rows; y += 1) {
        // without subtracting 1, the last line would not be drawn within the canvas
        const canvasY = Math.round((canvas.height - 1) * y / puzzle.rows);
        context.fillRect(0, canvasY, canvas.width, 1);
    }
    context.restore();
}

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
export function drawPuzzleRegionBackgrounds(canvas: WebOrNodeCanvas, puzzle: Puzzle): void {
    /**
     * @returns hex string of a random HSL color that has been determined to be suitable for a puzzle region background
     * (i.e. not too dark).
     */
    function getRandomColor(): string {
        const degrees = 360;
        const lightness = 75;
        const percent = 100;
        return `hsl(${Math.floor(Math.random() * degrees)}, ${Math.floor(Math.random() * percent)}%, ${lightness}%)`;
    }

    const context = canvas.getContext("2d") ?? assert.fail("null context");
    context.save(); // save current context state to not mutate it as it appears to an outside observer.
    const regionColors = new Map<number, string>();

    for (let x = 0; x < puzzle.cols; x += 1) {
        for (let y = 0; y < puzzle.rows; y += 1) {
            const {
                squareLeft,
                squareRight,
                squareTop,
                squareBottom,
            } = getSquareBounds(canvas, puzzle, {col: x, row: y});

            const regionId = puzzle.getCell({col: x, row: y}).regionId;
            const regionColor = regionColors.get(regionId) ?? getRandomColor();
            regionColors.set(regionId, regionColor);

            context.fillStyle = regionColor;
            context.fillRect(squareLeft, squareTop, squareRight - squareLeft, squareBottom - squareTop);
        }
    }
    context.restore();
}


/**
 * Draws border around the regions of the puzzle.
 * Each border is 3 units wide and black in color.
 * Each border segment is drawn with endpoints as close to integer pixel positions as possible.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
export function drawPuzzleRegionBorders(canvas : WebOrNodeCanvas, puzzle : Puzzle) : void {
    const lineWidth = 3;
    // padding for "ends" of drawing segments so it doesn't look chopped off
    const extraPadding = Math.floor(lineWidth/2);
    const context = canvas.getContext('2d') ?? assert.fail('null context');
    context.save(); // save current context state to not mutate it as it appears to an outside observer.
    context.strokeStyle = 'black';
    context.lineWidth = lineWidth;
    context.beginPath();
    
    // check the cells (i, j) and (i - 1, j), if they are not 
    // from the same region, then add a horizontal border between them
    for(let i = 1; i < puzzle.rows; i++) {
        for(let j = 0; j < puzzle.cols; j++) {
            const startX = getCanvasPixelX(canvas, j / puzzle.cols) - extraPadding;
            const endX = getCanvasPixelX(canvas, (j+1) / puzzle.cols) + extraPadding;
            const y = getCanvasPixelY(canvas, i / puzzle.rows);
            if(puzzle.getCell({row: i - 1, col: j}).regionId !== puzzle.getCell({row: i, col: j}).regionId) {
                context.moveTo(startX, y);
                context.lineTo(endX, y);
            }
        }
    }

    // check the cells (i, j) and (i, j - 1), if they are not 
    // from the same region, then add a vertical border between them
    for(let i = 0; i < puzzle.rows; i++) {
        for(let j = 1; j < puzzle.cols; j++) {
            const x = getCanvasPixelX(canvas, j / puzzle.cols);
            const startY = getCanvasPixelY(canvas, i / puzzle.rows) - extraPadding;
            const endY = getCanvasPixelY(canvas, (i + 1) / puzzle.rows) + extraPadding;
            if(puzzle.getCell({row: i, col: j - 1}).regionId !== puzzle.getCell({row: i, col: j}).regionId) {
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


/**
 * Draws the stars of the puzzle onto a canvas, using canvas's width and height.
 * The star icon is drawn with black color and will cover the center pixel of each square cell.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn upon.
 */
export function drawPuzzleStars(canvas: WebOrNodeCanvas, puzzle: Puzzle): void {
    const context = canvas.getContext("2d") ?? assert.fail("null context");
    context.save(); // save current context state to not mutate it as it appears to an outside observer.
    context.fillStyle = "#000000";

    /**
     * Draws a star symbol at the specified location and with the specified size.
     *
     * @param left the left bound of the star symbol, positive integer
     * @param top the top bound of the star symbol, positive integer
     * @param width the width the star symbol occupies, positive integer
     * @param height the height the star symbol occupies, positive integer
     */
    function drawStar(left: number, top: number, width: number, height: number): void {
        const MIDDLE = 0.5;
        const MAJOR_LENGTH = 0.4;
        const MINOR_LENGTH = 0.15;
        const starPaths: [number, number][][] = [
            [[MIDDLE, MIDDLE - MAJOR_LENGTH], [MIDDLE - MINOR_LENGTH, MIDDLE]],
            [[MIDDLE + MAJOR_LENGTH, MIDDLE], [MIDDLE, MIDDLE - MINOR_LENGTH]],
            [[MIDDLE, MIDDLE + MAJOR_LENGTH], [MIDDLE + MINOR_LENGTH, MIDDLE]],
            [[MIDDLE - MAJOR_LENGTH, MIDDLE], [MIDDLE, MIDDLE + MINOR_LENGTH]],
        ];

        const relativeToAbsoluteX = (x: number): number => Math.round(left + width * x);
        const relativeToAbsoluteY = (y: number): number => Math.round(top + height * y);

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
            const {
                squareLeft,
                squareRight,
                squareTop,
                squareBottom,
            } = getSquareBounds(canvas, puzzle, {col: x, row: y});

            if (puzzle.getCell({col: x, row: y}).containsStar) {
                drawStar(squareLeft, squareTop, squareRight - squareLeft, squareBottom - squareTop);
            }
        }
    }
    context.restore();
}

/**
 * Given:
 *
 * @param canvas a canvas object
 * @param floatX a fractional horizontal distance across this canvas. Must be between 0 and 1 inclusive
 * @returns the closest integer pixel to floatX.
 */
function getCanvasPixelX(canvas: WebOrNodeCanvas, floatX: number): number {
    return Math.round((canvas.width) * floatX);
}

/**
 * Given:
 *
 * @param canvas a canvas object
 * @param floatY a fractional vertical distance across this canvas. Must be between 0 and 1 inclusive
 * @returns the closest integer pixel to floatY.
 */
function getCanvasPixelY(canvas: WebOrNodeCanvas, floatY: number): number {
    return Math.round((canvas.height) * floatY);
}

/**
 * Given:
 *
 * @param canvas a canvas object puzzle will be drawn upon
 * @param puzzle the Star Battle puzzle object
 * @param squarePosition cell position
 * @returns nearest integer pixel bounds of the square cell on the canvas
 */
function getSquareBounds(canvas: WebOrNodeCanvas, puzzle: Puzzle, squarePosition: Position):
    {squareLeft: number, squareRight: number, squareTop: number, squareBottom: number} {
    return {
        squareLeft: getCanvasPixelX(canvas, squarePosition.col / puzzle.cols),
        squareRight: getCanvasPixelX(canvas, (squarePosition.col + 1) / puzzle.cols),
        squareTop: getCanvasPixelY(canvas, squarePosition.row / puzzle.cols),
        squareBottom: getCanvasPixelY(canvas, (squarePosition.row + 1) / puzzle.cols),
    };
}
