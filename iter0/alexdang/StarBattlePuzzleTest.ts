import assert from "assert";

describe('StarBattlePuzzle', function () {
    /**
     * Testing strategy:
     *      constructor- must accept valid puzzle states:
     *          blank (0 = #stars)/ partially solved (0 < #stars < 2n)/ solved (2n = #stars)
     *      flip- partition results in a state:
     *          invalid state: test throws error (or whatever output it should give in this case)/
     *              further partition: invalid because...
     *                   too many stars in a region/ row/ column
     *          valid state: test doesn't throw error
     *      isSolved- partition on this
     *          is actually solved/ is not solved
     */
});