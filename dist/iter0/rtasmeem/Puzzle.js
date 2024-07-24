"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePuzzle = void 0;
class PuzzleRegionList {
    // Abstraction function:
    //   AF(rows, cols, regions, stars) = 
    //          A Puzzle object with `rows` rows and `cols` columns,
    //          and regions.length regions and stars.length stars, 
    //          with the i th region consisting of the list of cells regions[i], 
    //          and  the i th star positioning at cell stars[i]
    // 
    // Representation Invariant:
    //   RI(rows, cols, regions, stars) = 
    //         true if and only if
    //         1) rows and cols are positive integers
    //         2) sum of regions[i].length is rows * cols
    //         3) stars.length <= rows * cols
    //         4) regions[i] forms a connected set of cells for any i in [0, regions.length)
    //   
    //   Here, connected means that there exists a path from any cell in the region to any other 
    //   cell in the region without traversing any cell outside of the region
    //
    //
    // Safety from rep exposure
    //   1) regions and stars arrays are defensively copied by the constructor to prevent rep exposure
    //   2) all variables in the representation are private, readonly and immutable, so they cannot be 
    //      accessed or modified by the client
    //   3) Since all functions return immutable objects, there cannot be any rep exposure.
    constructor(rows, cols, regions, stars = []) {
        // TODO defensively copy everything to the rep
        throw Error("Not implemented yet");
    }
    checkRep() {
        // TODO
    }
    /**
     * @inheritdoc
     */
    flip(row, col) {
        throw Error("Not implemented yet");
    }
    /**
     * @inheritdoc
     */
    isStar(row, col) {
        throw Error("Not implemented yet");
    }
    /**
     * @inheritdoc
     */
    isSameRegion(row1, col1, row2, col2) {
        throw Error("Not implemented yet");
    }
    /**
     * @inheritdoc
     */
    isComplete() {
        throw Error("Not implemented yet");
    }
    /**
     * @inheritdoc
     */
    equalValue(other) {
        throw Error("Not implemented yet");
    }
    /**
     * @inheritdoc
     */
    format() {
        throw Error("Not implemented yet");
    }
}
/**
 * Creates a Puzzle object by parsing the string representation of the puzzle
 *
 * @param rep string representation of the puzzle
 * @throws exception if the string cannot be parsed
 * @returns a newly created puzzle object
 */
function makePuzzle(rep) {
    throw Error("Not implemented yet");
}
exports.makePuzzle = makePuzzle;
//# sourceMappingURL=Puzzle.js.map