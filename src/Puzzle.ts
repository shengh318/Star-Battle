import assert from "assert";

/**
 * Immutable record type representing a single cell in a Star Battle Puzzle.
 *
 * @property {boolean} containsStar - whether this cell is marked with a star.
 * @property {number} regionId- numerical id identifying the unique region in the puzzle this cell belongs to.
 */
export type StarBattleCell = {
    readonly containsStar: boolean;
    readonly regionId: number;
};

/**
 * Immutable record type representing a position with x and y value such that on a 2D array it would represent the position (x,y).
 *
 * @property {number} x- the row number
 * @property {number} y- the col number
 */
export type Position = {
    readonly row: number;
    readonly col: number;
};

export interface StarPuzzle {
    readonly rows: number;
    readonly cols: number;

    /**
     * Attempts to flip the state of the cell at this position, where flipping a cell means it becomes unmarked
     * if it already is marked with a star, and vice versa.
     *
     * @param pos where
     *              pos.x is value of the position, from the left. Must be a non-negative integer.
     *              pos.y is value of the position, from the top. Must be a non-negative integer.
     * @returns new `StarPuzzle`instance reflecting the updated state if this operation succeeds.
     * @throws Error if flipping this cell would result in an invalid state.
     */
    flip(pos: Position): StarPuzzle;

    /**
     * Returns true if the puzzle is already in a solved state. False otherwise
     *
     * @returns a boolean value described above.
     */
    isSolved(): boolean;

    /**
     * Returns the StarBattleCell at the position x,y.
     *
     * @param pos where
     *              pos.x is value of the position, from the left. Must be a non-negative integer.
     *              pos.y is value of the position, from the top. Must be a non-negative integer.
     * @returns a StarBattleCell at that position on the board.
     */
    getCell(pos: Position): StarBattleCell;

    /**
     * Returns the 2D board that represents the current state of the board.
     *
     * @returns a 2D StarBattleCell described above.
     */
    getBoard(): StarBattleCell[][];

    /**
     * Returns a parsable string version of the board shown in the project handout.
     *
     * @returns a parsable string of the board
     */
    toString(): string;

    /**
     * Returns true if the other puzzle has the same number of rows, same number of cols,
     * and the stars in the exact same place as the current board.
     *
     * @param other other puzzle that you want to compare the current puzzle to
     */
    equalValue(other: StarPuzzle): boolean;

    /**
     * Returns the another board with the same regions and dimensions without the stars.
     */
    clearBoard(): StarPuzzle;
}

export class Puzzle implements StarPuzzle {
    /**
     * Abstraction Function:
     *
     *      A state of a `n` by `n` Star Battle puzzle where `n` is puzzleCells.length, where the first index
     *      of each square cell corresponds to its row from the top and the second index corresponds to its column
     *      from the left, and containing regions defined as the set of cells in puzzleCells sharing a common region id.
     *
     * Rep Invariants:
     *      -> puzzleCells is a square 2D array.
     *              this.row === this.col
     *      -> There are only `n` unique regions.
     *      -> All regions should be contigious meaning that for a specific region, all cells in that region are reachable
     *         to each other by going up, left, right, down
     *
     * Exposure Safety:
     *      -> immutable objects are public readonly
     *      -> anytime there are mutable objects being passed into a function, there will be a defensive copy created
     *         and the function will work off of that defensive copy
     *      -> anytime the function returns an instance, the instance will either be immutable data type or a copied version
     *
     */

    private readonly boardState: StarBattleCell[][];

    /**
     * Returns a Puzzle object
     *
     * @param rows the number of rows the board has
     * @param cols the number of cols the board has
     * @param board the current state of the board
     */
    public constructor(
        public readonly rows: number,
        public readonly cols: number,
        board: StarBattleCell[][]
    ) {
        this.boardState = this.deepCopyBoard(board);
        this.checkRep();
    }

    /**
     * Returns the total number of cells with the specific regID
     *
     * @param regID the regionID that you want to get the area
     * @returns the total number of cells with that specific regID
     */
    private getRegionArea(regID: number): number {
        const count: number = this.boardState.reduce(
            (totalCount: number, currRow: StarBattleCell[]) => {
                const rowCount: number = currRow.reduce(
                    (currCount: number, cell: StarBattleCell) => {
                        if (cell.regionId === regID) {
                            return currCount + 1;
                        }
                        return currCount;
                    },
                    0
                );

                return totalCount + rowCount;
            },
            0
        );

        return count;
    }

    /**
     * Returns a position on the board of the cell that has the specific regID or undefined
     * if no cells with that regID has been found in the current board state.
     *
     * @param regID the regionID you want to get a position at
     * @returns described above.
     */
    private getRegIDPos(regID: number): Position | undefined {
        for (let row = 0; row < this.rows; row++) {
            const currRow: StarBattleCell[] =
                this.boardState[row] ?? assert.fail("Invalid row!");
            for (let col = 0; col < this.cols; col++) {
                const currCell: StarBattleCell =
                    currRow[col] ?? assert.fail("Invalid Col!");
                if (currCell.regionId === regID) {
                    return { row: row, col: col };
                }
            }
        }
        return undefined;
    }

    /**
     * Given a regID and a staring cell with at regID, run the floodfill alg to see
     * how many cells the floodfill can cover by going left, right, up, and down.
     *
     * @param regID the specific regID that we are running floodfill on
     * @param startingCell the starting cell that should be a valid cell on the board and
     *        startingCell.regionID === regID
     *
     * @returns the number of tiles that can be floodfilled from the startingCell by going
     *          left, right, up, down to other cells that also contains the same regID
     *
     */
    private floodFill(regID: number, startingCell: Position): number {
        let cellCount = 0;
        const directions: number[][] = [
            [1, 0],
            [-1, 0],
            [0, +1],
            [0, -1],
        ];

        const seen: Position[] = [startingCell];
        const queue: Position[] = [startingCell];

        while (queue.length !== 0) {
            const currCell: Position =
                queue.shift() ?? assert.fail("There are no items in the queue!");
            cellCount += 1;
            const neighbors: Position[] = this.getNeighbors(currCell, directions);
            for (const neighbor of neighbors) {
                const neighborCell: StarBattleCell = this.getCell(neighbor);
                if (
                    !this.posInArray(seen, neighbor) &&
                    neighborCell.regionId === regID
                ) {
                    seen.push(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return cellCount;
    }

    /**
     * Checks to make sure that the currPosition is a valid position inside of the 2D board.
     *
     * @param currPosition the position that you want to check
     * @returns true if the currPosition is a valid position inside of the 2D board
     *          false otherwise
     */
    private isValidPosition(currPosition: Position): boolean {
        const goodX: boolean = 0 <= currPosition.row && currPosition.row < this.rows;
        const goodY: boolean = 0 <= currPosition.col && currPosition.col < this.cols;
        return goodX && goodY;
    }

    /**
     * Given a position, return the 4 neighbors up, down, left, and right that are
     * valid within the dimensions of the board.
     *
     * @param currPosition the current position that you want to get the neighbors
     * @param directions all the directions that the neighbor can be from
     * @returns a list of valid neighbors for that current position for this.boardState
     */
    private getNeighbors(
        currPosition: Position,
        directions: number[][]
    ): Position[] {
        const neighbors: Position[] = [];

        for (const direction of directions) {
            const deltaX: number =
                direction[0] ?? assert.fail("Directions needs a delta X");
            const deltaY: number =
                direction[1] ?? assert.fail("Directions needs a delta Y");
            const newPos: Position = {
                row: currPosition.row + deltaX,
                col: currPosition.col + deltaY,
            };
            if (this.isValidPosition(newPos)) {
                neighbors.push(newPos);
            }
        }

        return neighbors;
    }

    /**
     * Given an array of positions, check to see if checkPosition is already in the array.
     *
     * @param array the array to check
     * @param checkPosition the position to check to see if this position already appears inside of the array
     * @returns true if checkPosition in array. False otherwise.
     */
    private posInArray(array: Position[], checkPosition: Position): boolean {
        for (const pos of array) {
            const sameX: boolean = checkPosition.row === pos.row;
            const sameY: boolean = checkPosition.col === pos.col;
            if (sameX && sameY) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks to make sure all regions inside of the board are contigious.
     *
     * @throws error if they are not contigious as described in the rep invariant
     */
    private checkContigiousRegion(): void {
        const allRegions: number[] = [...this.getAllRegionID()];
        for (const region of allRegions) {
            //get the region area
            const regionArea: number = this.getRegionArea(region);

            //run flood fill to see how much area flood fill can cover
            const randomStartCell: Position =
                this.getRegIDPos(region) ??
                assert.fail(`There are no cells with region id ${region}!`);

            const floodFillCount: number = this.floodFill(region, randomStartCell);

            //compare results
            assert(
                regionArea === floodFillCount,
                `The region ${region} is not contigious!`
            );
        }
    }

    /**
     * Checks to make sure that all regions have <= 2 stars
     *
     * @throws error if any regions violates the rep invariant of having > 2 stars.
     */
    private regionCheck(): void {
        const allRegions: number[] = [...this.getAllRegionID()];
        for (const region of allRegions) {
            const currStarCount: number = this.regionStarCount(region);
            assert(
                currStarCount <= 2,
                `Region ${region} have ${currStarCount} stars!`
            );
        }
    }

    /**
     * Checks to make sure that all rows have <= 2 stars
     *
     * @throws error if any rows violates the rep invariant of having > 2 stars.
     */
    private rowCheck(): void {
        for (let i = 0; i < this.rows; i++) {
            const starCount: number = this.rowStarCount(i);
            assert(starCount <= 2, `Row ${i} have ${starCount} stars!`);
        }
    }

    /**
     * Checks to make sure that all cols have <= 2 stars
     *
     * @throws error if any cols violates the rep invariant of having > 2 stars.
     */
    private colCheck(): void {
        for (let i = 0; i < this.cols; i++) {
            const starCount: number = this.colStarCount(i);
            assert(starCount <= 2, `Col ${i} have ${starCount} stars!`);
        }
    }

    /**
     * Make sure that the rep invariant is being followed
     */
    private checkRep(): void {
        assert(this.rows === this.cols, "The board must be a square!");

        assert(this.rows === this.boardState.length, `The board must have ${this.rows} # of rows!`);

        for (const row of this.boardState) {
            assert(this.cols === row.length, `Each row must have ${this.cols} # of cols!`);
        }

        const regionCount: number = this.getAllRegionID().size;
        assert(
            regionCount === this.rows,
            `There must be ${this.rows} different regions! Got ${regionCount}`
        );

        //check contigious region
        this.checkContigiousRegion();
    }

    /**
     * Returns an array of position where all positions are valid positions in the board
     * that contains stars
     *
     * @returns as described above.
     */
    private getStarPosArray(): Position[] {
        const starPos: Position[] = [];

        for (let row = 0; row < this.rows; row++) {
            const currRow: StarBattleCell[] =
                this.boardState[row] ?? assert.fail("Invalid row!");
            for (let col = 0; col < this.cols; col++) {
                const currCell: StarBattleCell =
                    currRow[col] ?? assert.fail("Invalid Col!");
                if (currCell.containsStar) {
                    const newPos: Position = { row: row, col: col };
                    starPos.push(newPos);
                }
            }
        }
        return starPos;
    }

    /**
     * Checks to make sure that any cell that contains a star does not touch any other cell
     * that contains a star up, down, left, right, or diagonally
     *
     * @throws error if a star violates the condition described above.
     */
    private surroundCheckRep(): void {
        //get the directions of the neighbors
        const directions: number[][] = [];
        for (let deltaX = -1; deltaX <= 1; deltaX++) {
            for (let deltaY = -1; deltaY <= 1; deltaY++) {
                const currDir: number[] = [deltaX, deltaY];
                if (deltaX !== 0 || deltaY !== 0) {
                    directions.push(currDir);
                }
            }
        }

        //get the positions that contains stars
        const starPoses: Position[] = this.getStarPosArray();
        for (const pos of starPoses) {
            const neighbors: Position[] = this.getNeighbors(pos, directions);
            for (const neighbor of neighbors) {
                const neighborCell: StarBattleCell = this.getCell(neighbor);
                assert(
                    !neighborCell.containsStar,
                    `Neighbor at (${neighbor.row}, ${neighbor.col}) contains a star!`
                );
            }
        }
    }

    /**
     * Checks the surrounding 3x3 area of (x,y) with (x,y) as its center to make sure that
     * the star that is going to be added at this position doesn't violate the rep invariant
     *
     * @param pos where
     *              pos.x is value of the position, from the left. Must be a non-negative integer.
     *              pos.y is value of the position, from the top. Must be a non-negative integer.
     * @throws error if any of the position surrounding the cell contains stars.
     */
    private checkSurround(pos: Position): void {
        const beginRow: number = pos.row - 1;
        const endRow: number = pos.row + 2;
        const beginCol: number = pos.col - 1;
        const endCol: number = pos.col + 2;

        for (let i = beginRow; i < endRow; i++) {
            const currRow: StarBattleCell[] | undefined = this.boardState[i];

            if (currRow === undefined) {
                continue;
            }

            for (let j = beginCol; j < endCol; j++) {
                const currCell: StarBattleCell | undefined = currRow[j];
                if (currCell !== undefined && i !== pos.row && j !== pos.col) {
                    assert(!currCell.containsStar, `(${i}, ${j}) contains a star!`);
                }
            }
        }
    }

    /**
     * Returns the number of stars with the regionID that is in the current state of the board.
     *
     * @param regionID a specific regionID
     * @returns as described above
     */
    private regionStarCount(regionID: number): number {
        const starCount: number = this.boardState.reduce(
            (totalPrevCount: number, row: StarBattleCell[]) => {
                return (
                    totalPrevCount +
                    row.reduce((rowPrevCount: number, cell: StarBattleCell) => {
                        if (cell.containsStar && cell.regionId === regionID) {
                            return rowPrevCount + 1;
                        }
                        return rowPrevCount;
                    }, 0)
                );
            },
            0
        );

        return starCount;
    }

    /**
     * Counts the number of stars in the given row
     *
     * @param row the row that you are checking
     * @returns the number of stars that row has
     */
    private rowStarCount(row: number): number {
        const currRow: StarBattleCell[] =
            this.boardState[row] ?? assert.fail("Invalid row!");
        const starCount: number = currRow.reduce(
            (prevCount: number, cell: StarBattleCell) => {
                if (cell.containsStar) {
                    return prevCount + 1;
                }
                return prevCount;
            },
            0
        );

        return starCount;
    }

    /**
     * Counts the number of stars in the given col
     *
     * @param col the col that you are checking
     * @returns the number of stars that col has
     */
    private colStarCount(col: number): number {
        const currCol: StarBattleCell[] = this.boardState.map(
            (row: StarBattleCell[]) => {
                const colCell: StarBattleCell = row[col] ?? assert.fail("Invalid col!");
                return colCell;
            }
        );

        const starCount: number = currCol.reduce(
            (prevCount: number, cell: StarBattleCell) => {
                if (cell.containsStar) {
                    return prevCount + 1;
                }
                return prevCount;
            },
            0
        );

        return starCount;
    }

    /**
     * @inheritdoc
     */
    public flip(pos: Position): Puzzle {
        const currCell: StarBattleCell = this.getCell(pos);
        let flipToStar = false;

        //if the cell trying to flip over is not star, then flip it over with check
        if (!currCell.containsStar) {
            // //check the surround to make sure that it's not touching adjacent stars
            // this.checkSurround(pos);

            // //check the region so that it doesn't already contain 2 stars
            // assert(
            //     this.regionStarCount(currCell.regionId) < 2,
            //     `Region ${currCell.regionId} already contains 2 stars!`
            // );

            // //check the row to make sure that it doesn't already contain 2 stars
            // assert(
            //     this.rowStarCount(pos.x) < 2,
            //     `Row ${pos.x} already contains 2 stars!`
            // );

            // //check the col to make sure that it doesn't already contain 2 stars
            // assert(
            //     this.colStarCount(pos.y) < 2,
            //     `Col ${pos.y} already contains 2 stars!`
            // );

            flipToStar = true;
        } else {
            flipToStar = false;
        }

        //create the new cell
        const newCell: StarBattleCell = {
            containsStar: flipToStar,
            regionId: currCell.regionId,
        };

        //create the new board
        const copiedBoard: StarBattleCell[][] = this.deepCopyBoard(this.boardState);
        const changeRow: StarBattleCell[] =
            copiedBoard[pos.row] ?? assert.fail("Invalid row!");

        //add the new cell into the new board
        if (changeRow[pos.col] !== undefined) {
            changeRow[pos.col] = newCell;
        } else {
            throw new Error("Invalid Col!");
        }

        return new Puzzle(this.rows, this.cols, copiedBoard);
    }

    /**
     * Returns all the regionID found in the current state of the board as a set.
     *
     * @returns as described above.
     */
    private getAllRegionID(): Set<number> {
        const regIDSet: Set<number> = this.boardState.reduce(
            (totalPrevSet: Set<number>, currRow: StarBattleCell[]) => {
                //reduce each row to a set of regID that only appear in that row
                const rowSet: Set<number> = currRow.reduce(
                    (rowPrevSet: Set<number>, cell: StarBattleCell) => {
                        rowPrevSet = new Set([...rowPrevSet, cell.regionId]);
                        return rowPrevSet;
                    },
                    new Set<number>()
                );

                //add each regID of each row into the totalPrevSet
                totalPrevSet = new Set([...totalPrevSet, ...rowSet]);
                return totalPrevSet;
            },
            new Set<number>()
        );

        return regIDSet;
    }

    /**
     * Checks all the region of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all regions have exactly 2 stars. False otherwise.
     */
    private checkAllRegion(): boolean {
        const allRegions: number[] = [...this.getAllRegionID()];
        for (const regID of allRegions) {
            const currStarCount: number = this.regionStarCount(regID);
            if (currStarCount !== 2) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks all the rows of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all rows have exactly 2 stars. False otherwise.
     */
    private checkAllRows(): boolean {
        for (let i = 0; i < this.rows; i++) {
            const starCount: number = this.rowStarCount(i);
            if (starCount !== 2) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks all the cols of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all cols have exactly 2 stars. False otherwise.
     */
    private checkAllCols(): boolean {
        for (let i = 0; i < this.cols; i++) {
            const starCount: number = this.colStarCount(i);
            if (starCount !== 2) {
                return false;
            }
        }
        return true;
    }

    /**
     * @inheritdoc
     */
    public isSolved(): boolean {
        //check to make sure that all regions contain 2 stars
        const allRegionGood: boolean = this.checkAllRegion();

        //check to make sure that all rows contain 2 stars
        const allRowGood: boolean = this.checkAllRows();

        //check to make sure that all cols contain 2 stars
        const allColsGood: boolean = this.checkAllCols();

        return allRegionGood && allColsGood && allRowGood;
    }

    /**
     * @inheritdoc
     */
    public getCell(pos: Position): StarBattleCell {
        const cellRow: StarBattleCell[] =
            this.boardState[pos.row] ?? assert.fail("Invalid x!");
        const cell: StarBattleCell = cellRow[pos.col] ?? assert.fail("Invalid Y!");
        return cell;
    }

    /**
     * @inheritdoc
     */
    public getBoard(): StarBattleCell[][] {
        const copyBoard: StarBattleCell[][] = this.deepCopyBoard(this.boardState);
        return copyBoard;
    }

    /**
     * Returns
     *      an array of Positions where each position represents a star inside of that specific region,
     *      and an array of positions where each position do not contain a star inside of that specific region
     *
     * @param regID the regionID that you want to look for the star coordinates
     * @returns as described above
     */
    private findStarCoord(regID: number): {
        star: Position[];
        noStar: Position[];
    } {
        const starCoords: Position[] = [];
        const noStarCoords: Position[] = [];

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currPosition: Position = { row: row, col: col };
                const currCell: StarBattleCell = this.getCell(currPosition);
                if (currCell.regionId === regID) {
                    if (currCell.containsStar) {
                        starCoords.push(currPosition);
                    } else {
                        noStarCoords.push(currPosition);
                    }
                }
            }
        }
        return { star: starCoords, noStar: noStarCoords };
    }

    /**
     * @inheritdoc
     */
    public toString(): string {
        let parsableString = `${this.rows}x${this.cols}\n`;

        //get all regions sorted
        const allRegions: number[] = [...this.getAllRegionID()].sort(
            (a, b) => a - b
        );

        for (const regID of allRegions) {
            //find all stars and no star coords
            const regCoords: { star: Position[]; noStar: Position[] } =
                this.findStarCoord(regID);
            const starCoords: Position[] = regCoords.star;
            const noStarCoords: Position[] = regCoords.noStar;

            //then create a string for each region
            const starString: string = starCoords.reduce(
                (currString: string, currPosition: Position) => {
                    return currString + `${currPosition.row + 1},${currPosition.col + 1}  `;
                },
                ""
            );

            //create no star string for each region
            const noStarString: string = noStarCoords.reduce(
                (currString: string, currPosition: Position) => {
                    return currString + `${currPosition.row + 1},${currPosition.col + 1} `;
                },
                ""
            );

            //add the strings onto the parsable string
            parsableString += `${starString}| ${noStarString}\n`;
        }

        return parsableString;
    }

    /**
     * @inheritdoc
     */
    public clearBoard(): Puzzle {
        const clearBoard: StarBattleCell[][] = this.boardState.map(
            (row: StarBattleCell[]) =>
                row.map((cell: StarBattleCell) => {
                    const noStar: StarBattleCell = {
                        containsStar: false,
                        regionId: cell.regionId,
                    };
                    return noStar;
                })
        );
        return new Puzzle(this.rows, this.cols, clearBoard);
    }

    /**
     * @inheritdoc
     */
    public equalValue(other: StarPuzzle): boolean {
        const sameRows: boolean = this.rows === other.rows;
        const sameCols: boolean = this.cols === other.cols;

        if (!sameRows || !sameCols) {
            return false;
        }

        //check the entire board
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currPosition: Position = { row: row, col: col };
                const thisCell: StarBattleCell = this.getCell(currPosition);
                const otherCell: StarBattleCell = other.getCell(currPosition);

                const sameRegID: boolean = thisCell.regionId === otherCell.regionId;
                const sameStar: boolean =
                    thisCell.containsStar === otherCell.containsStar;
                if (!sameRegID || !sameStar) {
                    console.log(thisCell, otherCell, currPosition);
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Returns a deep copy version of the board passed in.
     *
     * @param board the board that you want to create a deep copy from
     * @returns a deep copy version of board
     */
    private deepCopyBoard(board: StarBattleCell[][]): StarBattleCell[][] {
        const copyBoard: StarBattleCell[][] = board.map((row: StarBattleCell[]) =>
            row.map((cell) => cell)
        );

        return copyBoard;
    }
}
