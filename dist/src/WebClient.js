"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebClient = void 0;
const Parser_1 = require("./Parser");
const assert_1 = __importDefault(require("assert"));
const PuzzleDrawer_1 = require("./PuzzleDrawer");
/**
 * ADT representing the state of the web client of the Star Battle puzzle web interface.
 */
class WebClient {
    /**
     * Abstraction Function: puzzle represents the Star Battle puzzle the user is interacting with, and
     * the canvas object to draw the puzzle
     *
     * Rep invariant: canvas must have positive width and height
     *
     * Exposure: Puzzle is a immutable object, so there is no problem even if it's aliased.
     *           canvas is mutable and can be aliased. However, the drawImage function rerenders
     *           canvas object at each step, so our implementation still works if it's aliased by
     *           the client.
     */
    /**
     * Creates a new web client object
     *
     * @param puzzle puzzle object that the client is playing
     * @param canvas canvas object that renders the puzzle drawing
     */
    constructor(puzzle, canvas) {
        this.puzzle = puzzle;
        this.canvas = canvas;
        this.checkRep();
        this.drawPuzzle();
    }
    checkRep() {
        (0, assert_1.default)(this.canvas.width > 0);
        (0, assert_1.default)(this.canvas.height > 0);
    }
    /**
     * Creates a WebClient object that
     *
     * @param filename name of the file to load the puzzle from
     * @param canvas canvas object that draws the game
     * @returns a web client object that the client can interact with
     */
    static async request(filename, canvas) {
        const url = `http://localhost:8789/puzzles?name=${filename}`;
        return fetch(url, { method: 'get', mode: 'cors' })
            .then(response => response.text())
            .then(text => {
            console.log(text);
            return new WebClient((0, Parser_1.parse)(text), canvas);
        });
    }
    /**
     * Calculates the height of each row in the canvas drawing
     *
     * @returns the height of each row
     */
    get rowHeight() {
        return this.canvas.height / this.puzzle.rows;
    }
    /**
     * Calculates the width of each column in the canvas drawing
     *
     * @returns the width of each column
     */
    get colWidth() {
        return this.canvas.width / this.puzzle.cols;
    }
    /**
     * Returns true if the board that the client is playing with is solved.
     * False otherwise
     *
     * @returns as described above.
     */
    isBoardSolved() {
        return this.puzzle.isSolved();
    }
    /**
     * Adds or removes a star from the cell that was clicked
     *
     * @param offsetX x coordinate of the point that was clicked
     * @param offsetY y coordinate of the point that was clicked
     */
    click(offsetX, offsetY) {
        const position = {
            col: Math.floor(offsetX / this.colWidth),
            row: Math.floor(offsetY / this.rowHeight)
        };
        console.log(position.col, position.row);
        this.puzzle = this.puzzle.flip(position);
        this.drawPuzzle();
    }
    /**
     * draws this.puzzle to this.canvas
     */
    drawPuzzle() {
        (0, PuzzleDrawer_1.drawPuzzle)(this.canvas, this.puzzle);
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=WebClient.js.map