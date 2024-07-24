"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puzzle = void 0;
const assert_1 = __importDefault(require("assert"));
class Puzzle {
    /**
     * Returns a Puzzle object
     *
     * @param rows the number of rows the board has
     * @param cols the number of cols the board has
     * @param board the current state of the board
     */
    constructor(rows, cols, board) {
        this.rows = rows;
        this.cols = cols;
        this.boardState = this.deepCopyBoard(board);
        this.checkRep();
    }
    /**
     * Returns the total number of cells with the specific regID
     *
     * @param regID the regionID that you want to get the area
     * @returns the total number of cells with that specific regID
     */
    getRegionArea(regID) {
        const count = this.boardState.reduce((totalCount, currRow) => {
            const rowCount = currRow.reduce((currCount, cell) => {
                if (cell.regionId === regID) {
                    return currCount + 1;
                }
                return currCount;
            }, 0);
            return totalCount + rowCount;
        }, 0);
        return count;
    }
    /**
     * Returns a position on the board of the cell that has the specific regID or undefined
     * if no cells with that regID has been found in the current board state.
     *
     * @param regID the regionID you want to get a position at
     * @returns described above.
     */
    getRegIDPos(regID) {
        for (let row = 0; row < this.rows; row++) {
            const currRow = this.boardState[row] ?? assert_1.default.fail("Invalid row!");
            for (let col = 0; col < this.cols; col++) {
                const currCell = currRow[col] ?? assert_1.default.fail("Invalid Col!");
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
    floodFill(regID, startingCell) {
        let cellCount = 0;
        const directions = [
            [1, 0],
            [-1, 0],
            [0, +1],
            [0, -1],
        ];
        const seen = [startingCell];
        const queue = [startingCell];
        while (queue.length !== 0) {
            const currCell = queue.shift() ?? assert_1.default.fail("There are no items in the queue!");
            cellCount += 1;
            const neighbors = this.getNeighbors(currCell, directions);
            for (const neighbor of neighbors) {
                const neighborCell = this.getCell(neighbor);
                if (!this.posInArray(seen, neighbor) &&
                    neighborCell.regionId === regID) {
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
    isValidPosition(currPosition) {
        const goodX = 0 <= currPosition.row && currPosition.row < this.rows;
        const goodY = 0 <= currPosition.col && currPosition.col < this.cols;
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
    getNeighbors(currPosition, directions) {
        const neighbors = [];
        for (const direction of directions) {
            const deltaX = direction[0] ?? assert_1.default.fail("Directions needs a delta X");
            const deltaY = direction[1] ?? assert_1.default.fail("Directions needs a delta Y");
            const newPos = {
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
    posInArray(array, checkPosition) {
        for (const pos of array) {
            const sameX = checkPosition.row === pos.row;
            const sameY = checkPosition.col === pos.col;
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
    checkContigiousRegion() {
        const allRegions = [...this.getAllRegionID()];
        for (const region of allRegions) {
            //get the region area
            const regionArea = this.getRegionArea(region);
            //run flood fill to see how much area flood fill can cover
            const randomStartCell = this.getRegIDPos(region) ??
                assert_1.default.fail(`There are no cells with region id ${region}!`);
            const floodFillCount = this.floodFill(region, randomStartCell);
            //compare results
            (0, assert_1.default)(regionArea === floodFillCount, `The region ${region} is not contigious!`);
        }
    }
    /**
     * Checks to make sure that all regions have <= 2 stars
     *
     * @throws error if any regions violates the rep invariant of having > 2 stars.
     */
    regionCheck() {
        const allRegions = [...this.getAllRegionID()];
        for (const region of allRegions) {
            const currStarCount = this.regionStarCount(region);
            (0, assert_1.default)(currStarCount <= 2, `Region ${region} have ${currStarCount} stars!`);
        }
    }
    /**
     * Checks to make sure that all rows have <= 2 stars
     *
     * @throws error if any rows violates the rep invariant of having > 2 stars.
     */
    rowCheck() {
        for (let i = 0; i < this.rows; i++) {
            const starCount = this.rowStarCount(i);
            (0, assert_1.default)(starCount <= 2, `Row ${i} have ${starCount} stars!`);
        }
    }
    /**
     * Checks to make sure that all cols have <= 2 stars
     *
     * @throws error if any cols violates the rep invariant of having > 2 stars.
     */
    colCheck() {
        for (let i = 0; i < this.cols; i++) {
            const starCount = this.colStarCount(i);
            (0, assert_1.default)(starCount <= 2, `Col ${i} have ${starCount} stars!`);
        }
    }
    /**
     * Make sure that the rep invariant is being followed
     */
    checkRep() {
        (0, assert_1.default)(this.rows === this.cols, "The board must be a square!");
        (0, assert_1.default)(this.rows === this.boardState.length, `The board must have ${this.rows} # of rows!`);
        for (const row of this.boardState) {
            (0, assert_1.default)(this.cols === row.length, `Each row must have ${this.cols} # of cols!`);
        }
        const regionCount = this.getAllRegionID().size;
        (0, assert_1.default)(regionCount === this.rows, `There must be ${this.rows} different regions! Got ${regionCount}`);
        //check contigious region
        this.checkContigiousRegion();
    }
    /**
     * Returns an array of position where all positions are valid positions in the board
     * that contains stars
     *
     * @returns as described above.
     */
    getStarPosArray() {
        const starPos = [];
        for (let row = 0; row < this.rows; row++) {
            const currRow = this.boardState[row] ?? assert_1.default.fail("Invalid row!");
            for (let col = 0; col < this.cols; col++) {
                const currCell = currRow[col] ?? assert_1.default.fail("Invalid Col!");
                if (currCell.containsStar) {
                    const newPos = { row: row, col: col };
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
    surroundCheckRep() {
        //get the directions of the neighbors
        const directions = [];
        for (let deltaX = -1; deltaX <= 1; deltaX++) {
            for (let deltaY = -1; deltaY <= 1; deltaY++) {
                const currDir = [deltaX, deltaY];
                if (deltaX !== 0 || deltaY !== 0) {
                    directions.push(currDir);
                }
            }
        }
        //get the positions that contains stars
        const starPoses = this.getStarPosArray();
        for (const pos of starPoses) {
            const neighbors = this.getNeighbors(pos, directions);
            for (const neighbor of neighbors) {
                const neighborCell = this.getCell(neighbor);
                (0, assert_1.default)(!neighborCell.containsStar, `Neighbor at (${neighbor.row}, ${neighbor.col}) contains a star!`);
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
    checkSurround(pos) {
        const beginRow = pos.row - 1;
        const endRow = pos.row + 2;
        const beginCol = pos.col - 1;
        const endCol = pos.col + 2;
        for (let i = beginRow; i < endRow; i++) {
            const currRow = this.boardState[i];
            if (currRow === undefined) {
                continue;
            }
            for (let j = beginCol; j < endCol; j++) {
                const currCell = currRow[j];
                if (currCell !== undefined && i !== pos.row && j !== pos.col) {
                    (0, assert_1.default)(!currCell.containsStar, `(${i}, ${j}) contains a star!`);
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
    regionStarCount(regionID) {
        const starCount = this.boardState.reduce((totalPrevCount, row) => {
            return (totalPrevCount +
                row.reduce((rowPrevCount, cell) => {
                    if (cell.containsStar && cell.regionId === regionID) {
                        return rowPrevCount + 1;
                    }
                    return rowPrevCount;
                }, 0));
        }, 0);
        return starCount;
    }
    /**
     * Counts the number of stars in the given row
     *
     * @param row the row that you are checking
     * @returns the number of stars that row has
     */
    rowStarCount(row) {
        const currRow = this.boardState[row] ?? assert_1.default.fail("Invalid row!");
        const starCount = currRow.reduce((prevCount, cell) => {
            if (cell.containsStar) {
                return prevCount + 1;
            }
            return prevCount;
        }, 0);
        return starCount;
    }
    /**
     * Counts the number of stars in the given col
     *
     * @param col the col that you are checking
     * @returns the number of stars that col has
     */
    colStarCount(col) {
        const currCol = this.boardState.map((row) => {
            const colCell = row[col] ?? assert_1.default.fail("Invalid col!");
            return colCell;
        });
        const starCount = currCol.reduce((prevCount, cell) => {
            if (cell.containsStar) {
                return prevCount + 1;
            }
            return prevCount;
        }, 0);
        return starCount;
    }
    /**
     * @inheritdoc
     */
    flip(pos) {
        const currCell = this.getCell(pos);
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
        }
        else {
            flipToStar = false;
        }
        //create the new cell
        const newCell = {
            containsStar: flipToStar,
            regionId: currCell.regionId,
        };
        //create the new board
        const copiedBoard = this.deepCopyBoard(this.boardState);
        const changeRow = copiedBoard[pos.row] ?? assert_1.default.fail("Invalid row!");
        //add the new cell into the new board
        if (changeRow[pos.col] !== undefined) {
            changeRow[pos.col] = newCell;
        }
        else {
            throw new Error("Invalid Col!");
        }
        return new Puzzle(this.rows, this.cols, copiedBoard);
    }
    /**
     * Returns all the regionID found in the current state of the board as a set.
     *
     * @returns as described above.
     */
    getAllRegionID() {
        const regIDSet = this.boardState.reduce((totalPrevSet, currRow) => {
            //reduce each row to a set of regID that only appear in that row
            const rowSet = currRow.reduce((rowPrevSet, cell) => {
                rowPrevSet = new Set([...rowPrevSet, cell.regionId]);
                return rowPrevSet;
            }, new Set());
            //add each regID of each row into the totalPrevSet
            totalPrevSet = new Set([...totalPrevSet, ...rowSet]);
            return totalPrevSet;
        }, new Set());
        return regIDSet;
    }
    /**
     * Checks all the region of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all regions have exactly 2 stars. False otherwise.
     */
    checkAllRegion() {
        const allRegions = [...this.getAllRegionID()];
        for (const regID of allRegions) {
            const currStarCount = this.regionStarCount(regID);
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
    checkAllRows() {
        for (let i = 0; i < this.rows; i++) {
            const starCount = this.rowStarCount(i);
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
    checkAllCols() {
        for (let i = 0; i < this.cols; i++) {
            const starCount = this.colStarCount(i);
            if (starCount !== 2) {
                return false;
            }
        }
        return true;
    }
    /**
     * @inheritdoc
     */
    isSolved() {
        //check to make sure that all regions contain 2 stars
        const allRegionGood = this.checkAllRegion();
        //check to make sure that all rows contain 2 stars
        const allRowGood = this.checkAllRows();
        //check to make sure that all cols contain 2 stars
        const allColsGood = this.checkAllCols();
        return allRegionGood && allColsGood && allRowGood;
    }
    /**
     * @inheritdoc
     */
    getCell(pos) {
        const cellRow = this.boardState[pos.row] ?? assert_1.default.fail("Invalid x!");
        const cell = cellRow[pos.col] ?? assert_1.default.fail("Invalid Y!");
        return cell;
    }
    /**
     * @inheritdoc
     */
    getBoard() {
        const copyBoard = this.deepCopyBoard(this.boardState);
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
    findStarCoord(regID) {
        const starCoords = [];
        const noStarCoords = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currPosition = { row: row, col: col };
                const currCell = this.getCell(currPosition);
                if (currCell.regionId === regID) {
                    if (currCell.containsStar) {
                        starCoords.push(currPosition);
                    }
                    else {
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
    toString() {
        let parsableString = `${this.rows}x${this.cols}\n`;
        //get all regions sorted
        const allRegions = [...this.getAllRegionID()].sort((a, b) => a - b);
        for (const regID of allRegions) {
            //find all stars and no star coords
            const regCoords = this.findStarCoord(regID);
            const starCoords = regCoords.star;
            const noStarCoords = regCoords.noStar;
            //then create a string for each region
            const starString = starCoords.reduce((currString, currPosition) => {
                return currString + `${currPosition.row + 1},${currPosition.col + 1}  `;
            }, "");
            //create no star string for each region
            const noStarString = noStarCoords.reduce((currString, currPosition) => {
                return currString + `${currPosition.row + 1},${currPosition.col + 1} `;
            }, "");
            //add the strings onto the parsable string
            parsableString += `${starString}| ${noStarString}\n`;
        }
        return parsableString;
    }
    /**
     * @inheritdoc
     */
    clearBoard() {
        const clearBoard = this.boardState.map((row) => row.map((cell) => {
            const noStar = {
                containsStar: false,
                regionId: cell.regionId,
            };
            return noStar;
        }));
        return new Puzzle(this.rows, this.cols, clearBoard);
    }
    /**
     * @inheritdoc
     */
    equalValue(other) {
        const sameRows = this.rows === other.rows;
        const sameCols = this.cols === other.cols;
        if (!sameRows || !sameCols) {
            return false;
        }
        //check the entire board
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currPosition = { row: row, col: col };
                const thisCell = this.getCell(currPosition);
                const otherCell = other.getCell(currPosition);
                const sameRegID = thisCell.regionId === otherCell.regionId;
                const sameStar = thisCell.containsStar === otherCell.containsStar;
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
    deepCopyBoard(board) {
        const copyBoard = board.map((row) => row.map((cell) => cell));
        return copyBoard;
    }
}
exports.Puzzle = Puzzle;
//# sourceMappingURL=Puzzle.js.map