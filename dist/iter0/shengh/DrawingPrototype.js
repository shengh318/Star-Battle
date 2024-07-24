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
const BOX_SIZE = 16;
// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];
// semitransparent versions of those colors
const BACKGROUNDS = COLORS.map((color) => color + '60');
/**
 * Draw a black square filled with a random color.
 *
 * @param canvas canvas to draw on
 * @param x x position of center of box
 * @param y y position of center of box
 */
function drawBox(canvas, x, y) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);
    // draw the outer outline box centered on the origin (which is now (x,y))
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeRect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
    // reset the origin and styles back to defaults
    context.restore();
}
/**
 * Given a canvas, it will draw a row x col grid on the canvas.
 *
 * @param canvas the canvas that you are drawing the grid on.
 * @param rows the number of rows the grid will have
 * @param cols the number of cols the grid will have
 */
function drawGrid(canvas, rows, cols) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = i * BOX_SIZE + BOX_SIZE / 2;
            const y = j * BOX_SIZE + BOX_SIZE / 2;
            drawBox(canvas, x, y);
        }
    }
}
/**
 * Draws a blue sky colored star on a canvas.
 * If you want to look at the math behind this, it's on: https://javascript.plainenglish.io/how-to-draw-stars-with-javascript-and-html5-canvas-33ece95c19bf
 *
 * @param canvas the canvas that you want to draw the star on
 */
function drawStar(canvas) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // draw the star centered on the origin (which is now (x,y))
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    const radius = 10;
    const spikes = 5;
    const outerMul = 0.4;
    const innerMul = 0.2;
    context.beginPath();
    for (let i = 0; i < spikes; i++) {
        context.lineTo(Math.cos((outerMul + i * outerMul) * Math.PI) * radius, Math.sin((outerMul + i * outerMul) * Math.PI) * radius);
        context.lineTo(Math.cos((innerMul + i * outerMul) * Math.PI) * radius / 2, Math.sin((innerMul + i * outerMul) * Math.PI) * radius / 2);
    }
    context.closePath();
    context.stroke();
    // reset the origin and styles back to defaults
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
    const rows = 5;
    const cols = 5;
    // output area for printing
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    // canvas for drawing
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event) => {
        // drawBox(canvas, event.offsetX, event.offsetY);
        drawGrid(canvas, rows, cols);
    });
    // add initial instructions to the output area
    printOutput(outputArea, `Click in the canvas above to draw a box centered at that point`);
}
main();
//# sourceMappingURL=DrawingPrototype.js.map