"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Puzzle_1 = require("./Puzzle");
const assert_1 = __importDefault(require("assert"));
describe('StarBattlePuzzle', function () {
    //Testing Strategy
    /**
     * Constructor:
     *      Partition on the input:
     *              valid state input
     *              input that is not a square
     *              input that does not have n unique regions
     *              input that has a non contigious region
     *              input that has more than 2 stars in a row
     *              input that has more than 2 stars in a col
     *              input that has more than 2 stars in a region
     *              input that has stars touching vertically
     *              input that has stars touching horizontally
     *              input that has stars touching diagonally
     *
     * Flip:
     *      Partition on the position:
     *              flip a star to a blank
     *              flip a blank to a star
     *              bad flip
     *
     * isSolved:
     *      Partition on the state of the game:
     *              the game is solved
     *              the game is not solved
     */
    it(`Constructor Test 1
            input that is not a square`, () => {
        const row = 3;
        const col = 2;
        const board = [
            [{ containsStar: false, regionId: 1 }, { containsStar: false, regionId: 2 }],
            [{ containsStar: false, regionId: 1 }, { containsStar: false, regionId: 2 }],
            [{ containsStar: false, regionId: 1 }, { containsStar: false, regionId: 2 }]
        ];
        assert_1.default.throws(() => {
            const puzzle = new Puzzle_1.Puzzle(row, col, board);
        }, `Should throw an error!`);
    });
    it(`Constructor Test 2
            input that does not have n unique regions`);
    it(`Constructor Test 3
            input that has a non contigious region`);
    it(`Constructor Test 4
            input that has more than 2 stars in a row`);
    it(`Constructor Test 5
            input that has more than 2 stars in a col`);
    it(`Constructor Test 6
            input that has more than 2 stars in a region`);
    it(`Constructor Test 7
            input that has stars touching vertically`);
    it(`Constructor Test 8
            input that has stars touching horizontally`);
    it(`Constructor Test 8
            input that has stars touching diagonally`);
    it(`Constructor Test 9
            Valid Input`);
});
//# sourceMappingURL=PuzzleTest.js.map