import { Puzzle, Position } from "./Puzzle";
import { parse } from "./Parser";
import assert from "assert";
import {drawPuzzle} from "./PuzzleDrawer";
import type { Canvas, CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from 'canvas';

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
 * ADT representing the state of the web client of the Star Battle puzzle web interface.
 */
export class WebClient {
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
    private constructor(private puzzle : Puzzle,
                        private readonly canvas : WebOrNodeCanvas) {
                            this.checkRep();
                            this.drawPuzzle();
                        }

    private checkRep() : void {
        assert(this.canvas.width > 0);
        assert(this.canvas.height > 0);
    }
    /**
     * Creates a WebClient object that 
     * 
     * @param filename name of the file to load the puzzle from
     * @param canvas canvas object that draws the game
     * @returns a web client object that the client can interact with
     */
    public static async request(filename : string, canvas : WebOrNodeCanvas) : Promise <WebClient> { 
        const url = `http://localhost:8789/puzzles?name=${filename}`;
        return fetch(url, { method: 'get', mode: 'cors' })
                    .then(response => response.text())
                    .then(text => {
                        console.log(text);
                        return new WebClient(parse(text), canvas);
                    });
    }
    
    /**
     * Calculates the height of each row in the canvas drawing
     *
     * @returns the height of each row
     */
    private get rowHeight(): number {
        return this.canvas.height / this.puzzle.rows;
    }

    /**
     * Calculates the width of each column in the canvas drawing
     *
     * @returns the width of each column
     */
    private get colWidth(): number {
        return this.canvas.width/ this.puzzle.cols;
    }

    /**
     * Returns true if the board that the client is playing with is solved.
     * False otherwise
     * 
     * @returns as described above.
     */
    public isBoardSolved(): boolean{
        return this.puzzle.isSolved();
    }

    /**
     * Adds or removes a star from the cell that was clicked
     *
     * @param offsetX x coordinate of the point that was clicked
     * @param offsetY y coordinate of the point that was clicked
     */
    public click(offsetX : number, offsetY : number) : void {
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
    private drawPuzzle(): void {
        drawPuzzle(this.canvas, this.puzzle);
    }
}
