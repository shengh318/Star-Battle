/**
 * Immutable ADT representing some valid state of a Star Battle puzzle.
 */
export class StarBattlePuzzle {
    /**
     * Abstraction Function:
     *      A state of a `n` by `n` Star Battle puzzle where `n` is puzzleCells.length, where the first index
     *      of each square cell corresponds to its row from the top and the second index corresponds to its column
     *      from the left, and containing regions defined as the set of cells in puzzleCells sharing a common region id.
     * Rep Invariants:
     *      puzzleCells is a square 2D array.
     *      There are only `n` unique regions.
     *      Every region is contiguous meaning every cell in the region is reachable from any other cell by
     *      crossing through adjacent edges.
     *      No row, column, or region of puzzleCells may have more than 2 cells with marked stars.
     *      No two cells with marked stars in puzzleCells may be vertically, horizontally, or diagonally adjacent.
     * Exposure Safety:
     *      puzzleCells is readonly, is itself immutable, and is constructed using defensive copying.
     */
    public readonly puzzleCells: ReadonlyArray<ReadonlyArray<StarBattleCell>>;

    /**
     * Creates a StarBattlePuzzle in the state determined by `puzzleCells`.
     *
     * @see StarBattleCell
     * @param puzzleCells 2D array containing all the cells of the n x n puzzle, where n = `puzzleCells.length`,
     *                    and indices correspond to positions in the puzzle grid.
     *                    Must represent a valid state of a StarBattlePuzzle.
     * @throws error if `puzzleCells` does not represent a valid state of a StarBattlePuzzle.
     */
    public constructor(
        puzzleCells: ReadonlyArray<ReadonlyArray<StarBattleCell>>
    ) {
        throw new Error("Not Implemented");
        // TODO: make a copy of param to avoid aliasing
    }

    /**
     * Verifies the rep invariant of this `StarBattlePuzzle` instance.
     *
     * @private
     */
    private checkRep(): void {
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
    public flip(x: number, y: number): StarBattlePuzzle {
        throw new Error("Not Implemented");
    }

    /**
     * @returns whether this puzzle is in a solved state.
     */
    public isSolved(): boolean {
        throw new Error("Not Implemented");
    }
}

/**
 * Immutable record type representing a single cell in a Star Battle Puzzle.
 *
 * @property {boolean} containsStar - whether this cell is marked with a star.
 * @property {number} regionId- numerical id identifying the unique region in the puzzle this cell belongs to.
 */
export type StarBattleCell = {
    readonly containsStar: boolean
    readonly regionId: number
};