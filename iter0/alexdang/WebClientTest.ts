import assert from "assert";

describe('WebClient', function () {
    /**
     * Testing strategy:
     *      (manual): Puzzle load:
     *          1. On a new page load, assert a blank puzzle is displayed.
     *          2. Refresh and verify once again.
     *      (manual): Puzzle moves:
     *          1. From a blank puzzle, click on any square. Assert the square shows a star symbol.
     *          2. Click on the same square again. Assert the square no longer shows a star symbol.
     *          3. Click on 2 adjacent squares (diagonally as well). Assert the 2nd square does not
     *              show a star symbol.
     *          4. Refresh.
     *          5. Click on 3 squares in a row/ column. Assert the 3rd square does not show a star symbol.
     *          6. Refresh.
     *          7. Click on 3 squares within the same region. Assert the 3rd square does not show a star symbol.
     *      (manual): Puzzle solves:
     *          1. Solve the puzzle displayed by clicking on the solution squares.
     *          2. Assert a message is displayed indicating the puzzle has been solved.
     */
});