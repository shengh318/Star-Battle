"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Puzzle_1 = require("../src/Puzzle");
const Parser_1 = require("../src/Parser");
const assert_1 = __importDefault(require("assert"));
describe("StarBattlePuzzle", function () {
    //Testing Strategy
    /**
     * Constructor:
     *      Partition on the input:
     *              valid state input
     *              input that is not a square
     *              input that does not have n unique regions
     *              input that has a non contigious region
     *
     * isSolved:
     *      Partition on the state of the game:
     *              the game is solved
     *              the game is not solved
     *
     * clearBoard:
     *      Checks to make sure that the board is cleared
     */
    it(`Constructor Test 1
            input that is not a square`, () => {
        const row = 3;
        const col = 2;
        const board = [
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        assert_1.default.throws(() => {
            const puzzle = new Puzzle_1.Puzzle(row, col, board);
        }, `Should throw an error!`);
    });
    it(`Constructor Test 2
            input that does not have n unique regions`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        assert_1.default.throws(() => {
            const puzzle = new Puzzle_1.Puzzle(row, col, board);
        }, `Should throw an error!`);
    });
    it(`Constructor Test 3
            input that has a non contigious region`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
        ];
        assert_1.default.throws(() => {
            const puzzle = new Puzzle_1.Puzzle(row, col, board);
        }, `Should throw an error!`);
    });
    it(`Constructor Test 4
            Valid Input

        Flip Test 1
            Flip Star to a blank

        isSolved test 1
            game is not solved`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: true, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const newPuzzle = new Puzzle_1.Puzzle(row, col, board);
        //toString test
        const puzzleString = newPuzzle.toString();
        const parsedPuzzle = (0, Parser_1.parse)(puzzleString);
        (0, assert_1.default)(newPuzzle.equalValue(parsedPuzzle), "To string method is wrong!");
        const flipPos = { row: 1, col: 1 };
        const newBoard = newPuzzle.flip(flipPos);
        const expectedInfo = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const gotInfoBoard = newBoard.getBoard();
        assert_1.default.deepStrictEqual(gotInfoBoard, expectedInfo, "FullBoard Info are different!");
        assert_1.default.strictEqual(newBoard.isSolved(), false, "The game is not solved!");
    });
    it(`Flip Test 2
            Flip Blank to a Star
        isSolved test 2
            game is solved
        
        This is the actual puzzle from: https://krazydad.com/twonottouch/intro_tutorial/
        `, () => {
        const row = 10;
        const col = 10;
        //TODO CHANGE THE REGIONS HERE
        const board = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 3 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 3 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 6 },
                { containsStar: false, regionId: 6 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 6 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 6 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
            ],
        ];
        const newPuzzle = new Puzzle_1.Puzzle(row, col, board);
        const flipPoses = [
            { row: 1, col: 1 },
            { row: 1, col: 3 },
            { row: 3, col: 3 },
            { row: 2, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 8 },
            { row: 2, col: 9 },
            { row: 3, col: 7 },
            { row: 4, col: 5 },
            { row: 5, col: 7 },
            { row: 5, col: 9 },
            { row: 7, col: 8 },
            { row: 8, col: 6 },
            { row: 9, col: 4 },
            { row: 8, col: 2 },
            { row: 9, col: 0 },
            { row: 7, col: 0 },
            { row: 6, col: 2 },
            { row: 6, col: 4 },
            { row: 4, col: 1 },
        ];
        let finalBoard = newPuzzle;
        for (const move of flipPoses) {
            finalBoard = finalBoard.flip(move);
        }
        //toString test
        const puzzleString = finalBoard.toString();
        const parsedPuzzle = (0, Parser_1.parse)(puzzleString);
        (0, assert_1.default)(finalBoard.equalValue(parsedPuzzle), "To string method is wrong!");
        const expectedInfo = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 1 },
                { containsStar: true, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: true, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: true, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
                { containsStar: true, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: true, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 0 },
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 2 },
                { containsStar: false, regionId: 4 },
                { containsStar: true, regionId: 4 },
                { containsStar: false, regionId: 3 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 5 },
                { containsStar: true, regionId: 5 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: true, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 3 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 4 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: true, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: true, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 5 },
                { containsStar: false, regionId: 5 },
                { containsStar: true, regionId: 7 },
                { containsStar: false, regionId: 5 },
                { containsStar: true, regionId: 5 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: true, regionId: 6 },
                { containsStar: false, regionId: 6 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: true, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: false, regionId: 6 },
                { containsStar: false, regionId: 8 },
                { containsStar: true, regionId: 8 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 7 },
                { containsStar: true, regionId: 7 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 3 },
            ],
            [
                { containsStar: true, regionId: 6 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 8 },
                { containsStar: false, regionId: 8 },
                { containsStar: true, regionId: 8 },
                { containsStar: false, regionId: 7 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
                { containsStar: false, regionId: 9 },
            ],
        ];
        const gotInfoBoard = finalBoard.getBoard();
        assert_1.default.deepStrictEqual(gotInfoBoard, expectedInfo, "FullBoard Info are different!");
        assert_1.default.strictEqual(finalBoard.isSolved(), true, "The game is solved!");
    });
    it(`Flip Test 3
            Bad Flip`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: true, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const newPuzzle = new Puzzle_1.Puzzle(row, col, board);
        const flipPos = { row: 1, col: 0 };
        const badBoard = newPuzzle.flip(flipPos);
        const badBoardExpect = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: true, regionId: 0 },
                { containsStar: true, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        assert_1.default.deepStrictEqual(badBoard.getBoard(), badBoardExpect, "Bad Boards but still should flip!");
    });
    it(`Flip Test 4
            fips over a star in a row that already contains 2 stars`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: true, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const newPuzzle = new Puzzle_1.Puzzle(row, col, board);
        //toString test
        const puzzleString = newPuzzle.toString();
        const parsedPuzzle = (0, Parser_1.parse)(puzzleString);
        (0, assert_1.default)(newPuzzle.equalValue(parsedPuzzle), "To string method is wrong!");
        const flipPos = { row: 1, col: 2 };
        const newBoard = newPuzzle.flip(flipPos);
        const expectedInfo = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const gotInfoBoard = newBoard.getBoard();
        assert_1.default.deepStrictEqual(gotInfoBoard, expectedInfo, "FullBoard Info are different!");
        assert_1.default.strictEqual(newBoard.isSolved(), false, "The game is not solved!");
    });
    it(`Flip Test 5
            fips over a star in a col that already contains 2 stars`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const newPuzzle = new Puzzle_1.Puzzle(row, col, board);
        //toString test
        const puzzleString = newPuzzle.toString();
        const parsedPuzzle = (0, Parser_1.parse)(puzzleString);
        (0, assert_1.default)(newPuzzle.equalValue(parsedPuzzle), "To string method is wrong!");
        const flipPos = { row: 2, col: 0 };
        const newBoard = newPuzzle.flip(flipPos);
        const expectedInfo = [
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const gotInfoBoard = newBoard.getBoard();
        assert_1.default.deepStrictEqual(gotInfoBoard, expectedInfo, "FullBoard Info are different!");
        assert_1.default.strictEqual(newBoard.isSolved(), false, "The game is not solved!");
    });
    it(`Clear board test`, () => {
        const row = 3;
        const col = 3;
        const board = [
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: true, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const newPuzzle = new Puzzle_1.Puzzle(row, col, board);
        const clearBoard = newPuzzle.clearBoard();
        //clear board test
        const expectedInfo = [
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
            [
                { containsStar: false, regionId: 0 },
                { containsStar: false, regionId: 1 },
                { containsStar: false, regionId: 2 },
            ],
        ];
        const gotInfoBoard = clearBoard.getBoard();
        assert_1.default.deepStrictEqual(gotInfoBoard, expectedInfo, "FullBoard Info are different!");
        assert_1.default.strictEqual(clearBoard.isSolved(), false, "The game is not solved!");
    });
});
//# sourceMappingURL=PuzzleTest.js.map