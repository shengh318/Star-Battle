"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarBattlePuzzle = void 0;
/**
 * Immutable ADT representing some valid state of a Star Battle puzzle.
 */
class StarBattlePuzzle {
    /**
     * Creates a StarBattlePuzzle in the state determined by `puzzleCells`.
     *
     * @see StarBattleCell
     * @param puzzleCells 2D array containing all the cells of the n x n puzzle, where n = `puzzleCells.length`,
     *                    and indices correspond to positions in the puzzle grid.
     *                    Must represent a valid state of a StarBattlePuzzle.
     * @throws error if `puzzleCells` does not represent a valid state of a StarBattlePuzzle.
     */
    constructor(puzzleCells) {
        throw new Error("Not Implemented");
        // TODO: make a copy of param to avoid aliasing
    }
    /**
     * Verifies the rep invariant of this `StarBattlePuzzle` instance.
     *
     * @private
     */
    checkRep() {
        throw new Error("Not Implemented");
    }
    /**
     * Attempts to flip the state of the cell at this position, where flipping a cell means it becomes unmarked
     * if it already is marked with a star, and vice versa.
     *
     * @param x x value of the position, from the left. Must be a non-negative integer.
     * @param y y value of the position, from the top. Must be a non-negative integer.
     * @returns new `StarBattlePuzzle `instance reflecting the updated state if this operation succeeds.
     * @throws Error if flipping this cell would result in an invalid state.
     */
    flip(x, y) {
        throw new Error("Not Implemented");
    }
    /**
     * @returns whether this puzzle is in a solved state.
     */
    isSolved() {
        throw new Error("Not Implemented");
    }
}
exports.StarBattlePuzzle = StarBattlePuzzle;
//# sourceMappingURL=StarBattlePuzzle.js.map