"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Puzzle', async function () {
    // Testing strategy
    // 
    // 1) Partition on the maximum number of stars in a row
    //    = 0, 1, 2, > 2
    // 
    // 2) Partition on the maximum number of stars in a column
    //    = 0, 1, 2, > 2
    // 
    // 3) Partition on the maximum number of stars in a region
    //    = 0, 1, 2, > 2
    // 
    // 4) Partition on whether two cells are in the same region
    //    = yes, no
    //
    // 5) Partition on whether there is a star in a particular cell
    //    = yes, no
});
//# sourceMappingURL=PuzzleTest.js.map