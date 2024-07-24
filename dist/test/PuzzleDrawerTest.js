"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Puzzle_1 = require("../src/Puzzle");
const canvas_1 = require("canvas");
const PuzzleDrawer_1 = require("../src/PuzzleDrawer");
const Parser_1 = require("../src/Parser");
const fs_1 = __importDefault(require("fs"));
/**
 * Write the contents of this canvas object to a png image.
 * @param canvas the canvas
 * @param fileName the file to write to
 */
function writeCanvasToFile(canvas, fileName) {
    const buffer = canvas.toBuffer("image/png");
    fs_1.default.writeFileSync(`./test-output/${fileName}.png`, buffer);
}
describe('drawPuzzleGrid', function () {
    /**
     * Testing strategy:
     *      Partition on puzzle state:
     *          puzzle grid falls on integer values/ falls on fractional values
     *      Manual test: write canvas to png file, then visually inspect result.
     *          Assert that the result looks like a grid.
     */
    /**
     * Verify drawPuzzleGrid draws the puzzle grid correctly.
     *
     * @param puzzle the puzzle to test drawing the grid for.
     * @param width positive integer, width of the canvas to draw on.
     * @param height positive integer, height of the canvas to draw on.
     */
    function testGrid(puzzle, width, height) {
        const canvas = (0, canvas_1.createCanvas)(width, height);
        (0, PuzzleDrawer_1.drawPuzzleGrid)(canvas, puzzle);
        const ctx = canvas.getContext("2d");
        // test the grid intersection points
        for (let x = 0; x <= puzzle.cols; x += 1) {
            for (let y = 0; y <= puzzle.rows; y += 1) {
                const canvasX = Math.round((width - 1) * x / puzzle.cols);
                const canvasY = Math.round((height - 1) * y / puzzle.rows);
                const testPixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
                assert_1.default.deepStrictEqual([...testPixel], [0x55, 0x55, 0x55, 0xFF], `at ${canvasX}, ${canvasY}`);
            }
        }
        // test the center of each cell (so can't just color the entire canvas)
        for (let x = 0; x < puzzle.cols; x += 1) {
            for (let y = 0; y < puzzle.rows; y += 1) {
                const canvasX = Math.round((width - 1) * (x + 0.5) / puzzle.cols);
                const canvasY = Math.round((height - 1) * (y + 0.5) / puzzle.rows);
                const testPixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
                assert_1.default.deepStrictEqual([...testPixel], [0x0, 0x0, 0x0, 0x0], `at ${canvasX}, ${canvasY}`);
            }
        }
    }
    it('should work on grid on integer values', function () {
        testGrid(new Puzzle_1.Puzzle(2, 2, [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
            ],
        ]), 5, 17);
    });
    it('should work on grid on fractional values', function () {
        testGrid(new Puzzle_1.Puzzle(2, 2, [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
            ],
        ]), 16, 18);
    });
    it('manual test', async function () {
        const puzzle = (0, Parser_1.parse)((await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb")).toString());
        const canvas = (0, canvas_1.createCanvas)(500, 500);
        (0, PuzzleDrawer_1.drawPuzzleGrid)(canvas, puzzle);
        writeCanvasToFile(canvas, "drawPuzzleGrid");
    });
});
describe('drawPuzzleRegionBackgrounds', function () {
    /**
     * Testing strategy:
     *      puzzle cell bounds falls on integer values/ falls on fractional values
     *      Manual test: write canvas to png file, then visually inspect result.
     *          Assert that the result looks like regions.
     */
    /**
     * Verify correctness of drawPuzzleRegionBackgrounds.
     *
     * @param puzzle the puzzle to test drawing for.
     * @param width positive integer, width of the canvas to draw on.
     * @param height positive integer, height of the canvas to draw on.
     */
    function testRegions(puzzle, width, height) {
        const canvas = (0, canvas_1.createCanvas)(width, height);
        (0, PuzzleDrawer_1.drawPuzzleRegionBackgrounds)(canvas, puzzle);
        // writeCanvasToFile(canvas);
        const ctx = canvas.getContext("2d");
        const regionColors = new Map();
        // test the center of each cell (so can't just color the entire canvas)
        for (let x = 0; x < puzzle.cols; x += 1) {
            for (let y = 0; y < puzzle.rows; y += 1) {
                const canvasX = Math.round((width) * (x + 0.5) / puzzle.cols);
                const canvasY = Math.round((height) * (y + 0.5) / puzzle.rows);
                const key = puzzle.getCell({ col: x, row: y }).regionId;
                const testPixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
                const regionColor = regionColors.get(key);
                if (regionColor === undefined) {
                    regionColors.set(key, [...testPixel]);
                }
                else {
                    assert_1.default.deepStrictEqual([...testPixel], regionColor, `at ${canvasX}, ${canvasY}`);
                }
            }
        }
        // test the top left corner of each square cell
        for (let x = 0; x < puzzle.cols; x += 1) {
            for (let y = 0; y < puzzle.rows; y += 1) {
                const canvasX = Math.round((width) * x / puzzle.cols);
                const canvasY = Math.round((height) * y / puzzle.rows);
                const key = puzzle.getCell({ col: x, row: y }).regionId;
                const testPixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
                assert_1.default.deepStrictEqual([...testPixel], regionColors.get(key), `at ${canvasX}, ${canvasY}`);
            }
        }
    }
    it('should work on integer cell bounds', function () {
        testRegions(new Puzzle_1.Puzzle(2, 2, [[
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
            ]
        ]), 101, 101);
    });
    it('should work on fractional cell bounds', function () {
        testRegions(new Puzzle_1.Puzzle(3, 3, [[
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
            ],
            [
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
            ],
        ]), 60, 90);
    });
    it('manual test', async function () {
        const puzzle = (0, Parser_1.parse)((await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb")).toString());
        const canvas = (0, canvas_1.createCanvas)(500, 500);
        (0, PuzzleDrawer_1.drawPuzzleRegionBackgrounds)(canvas, puzzle);
        writeCanvasToFile(canvas, "drawPuzzleRegionBackgrounds");
    });
});
describe('drawPuzzleStars', function () {
    /**
     * Testing strategy:
     *      Partition on puzzle state:
     *          blank/ with stars
     *      Manual test:
     *          Assert the stars are in the correct position.
     */
    /**
     * Verify correctness of drawPuzzleStars.
     *
     * @param puzzle the puzzle to test drawing for.
     * @param width positive integer, width of the canvas to draw on.
     * @param height positive integer, height of the canvas to draw on.
     */
    function testStars(puzzle, width, height) {
        const canvas = (0, canvas_1.createCanvas)(width, height);
        (0, PuzzleDrawer_1.drawPuzzleStars)(canvas, puzzle);
        const ctx = canvas.getContext("2d");
        // test the center of each cell
        for (let x = 0; x < puzzle.cols; x += 1) {
            for (let y = 0; y < puzzle.rows; y += 1) {
                const canvasX = Math.round((width) * (x + 0.5) / puzzle.cols);
                const canvasY = Math.round((height) * (y + 0.5) / puzzle.rows);
                const testPixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
                if (puzzle.getCell({ col: x, row: y }).containsStar) {
                    // console.log(canvasX, canvasY)
                    assert_1.default.deepStrictEqual([...testPixel], [0x0, 0x0, 0x0, 0xFF], `at ${canvasX}, ${canvasY}`);
                }
                else {
                    assert_1.default.deepStrictEqual([...testPixel], [0x0, 0x0, 0x0, 0x0], `at ${canvasX}, ${canvasY}`);
                }
            }
        }
    }
    it('should work on blank puzzle', async function () {
        testStars((0, Parser_1.parse)((await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb")).toString()).clearBoard(), 101, 101);
    });
    it('should work on puzzle with stars', async function () {
        let puzzle = (0, Parser_1.parse)((await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb")).toString()).clearBoard();
        for (let i = 0; i < 10; i += 1) {
            puzzle = puzzle.flip({ col: i, row: i });
        }
        testStars(puzzle, 100, 200);
    });
    it('manual test', async function () {
        const puzzle = (0, Parser_1.parse)((await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb")).toString());
        const canvas = (0, canvas_1.createCanvas)(500, 500);
        (0, PuzzleDrawer_1.drawPuzzleStars)(canvas, puzzle);
        writeCanvasToFile(canvas, "drawPuzzleStars");
    });
});
describe('drawPuzzle', function () {
    /**
     * Testing strategy:
     *      Manual test
     */
    it('manual test', async function () {
        const puzzle = (0, Parser_1.parse)((await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb")).toString());
        const canvas = (0, canvas_1.createCanvas)(500, 500);
        (0, PuzzleDrawer_1.drawPuzzle)(canvas, puzzle);
        writeCanvasToFile(canvas, "drawPuzzle");
    });
});
//# sourceMappingURL=PuzzleDrawerTest.js.map