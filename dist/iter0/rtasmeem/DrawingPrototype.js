"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This code is loaded into example-page.html, see the `npm watchify-example` script.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const assert_1 = __importDefault(require("assert"));
function drawPuzzle(canvas) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas context');
    const rows = 3;
    const cols = 3;
    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const drawStar = (x, y) => {
        context.save();
        context.strokeStyle = 'black';
        context.fillStyle = "black";
        const offsetX = cellWidth * 0.16;
        const offsetY = cellHeight * 0.3;
        context.translate(x * cellWidth + offsetX, y * cellHeight + offsetY);
        const starLength = Math.min(cellHeight, cellWidth) / 2.5;
        context.beginPath();
        for (let i = 0; i < 6; i++) {
            context.moveTo(0, 0);
            context.quadraticCurveTo(starLength / 2, starLength / 2, 0, starLength);
            context.translate(0, starLength);
            context.rotate(-Math.PI / 3);
        }
        context.fill();
        context.restore();
    };
    context.save();
    // fill the entire board with grey-ish color
    context.fillStyle = '#c3c3c3';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawStar(0, 0);
    drawStar(1, 1);
    // draw vertical and horizontal lines for rows and columns
    context.strokeStyle = '#a3a3a3';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, cellHeight);
    context.lineTo(width, cellHeight);
    context.stroke();
    context.beginPath();
    context.moveTo(0, 2 * cellHeight);
    context.lineTo(width, 2 * cellHeight);
    context.stroke();
    context.beginPath();
    context.moveTo(cellWidth, 0);
    context.lineTo(cellWidth, height);
    context.stroke();
    context.beginPath();
    context.moveTo(2 * cellWidth, 0);
    context.lineTo(2 * cellWidth, height);
    context.stroke();
    // draw the region at the upper left corner
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, 2 * cellHeight);
    context.lineTo(cellWidth, 2 * cellHeight);
    context.lineTo(cellWidth, cellWidth);
    context.lineTo(2 * cellWidth, cellHeight);
    context.lineTo(2 * cellWidth, 0);
    context.stroke();
    // draw the region at the lower right corner
    context.beginPath();
    context.moveTo(2 * cellWidth, 3 * cellHeight);
    context.lineTo(2 * cellWidth, 2 * cellHeight);
    context.lineTo(3 * cellWidth, 2 * cellWidth);
    context.stroke();
    // draw the borders of the board to black
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.lineTo(0, 0);
    context.stroke();
    context.restore();
}
/**
 * Print a message by appending it to an HTML element.
 *
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea, message) {
    // append the message to the output area
    outputArea.innerText += message + '\n';
    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}
/**
 * Set up the example page.
 */
function main() {
    // output area for printing
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    // canvas for drawing
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    // when the user clicks on the drawing canvas...
    // canvas.addEventListener('click', (event: MouseEvent) => {
    //     drawBox(canvas, event.offsetX, event.offsetY);
    // });
    drawPuzzle(canvas);
    // add initial instructions to the output area
    printOutput(outputArea, `Demo 3 by 3 puzzle. Not necessarily solvable.`);
}
main();
//# sourceMappingURL=DrawingPrototype.js.map