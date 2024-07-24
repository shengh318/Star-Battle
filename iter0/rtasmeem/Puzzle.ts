export interface Puzzle {
    /**
     * Creates a new Puzzle and and adds a new star to cell at row `row` and
     * column `col` if there were no stars in that position, otherwise adds a new 
     * star in that position
     * 
     * @param row the row number
     * @param col the column number
     */
    flip(row : number, col : number): Puzzle;

    /**
     * Returns true if the cell at row = `row` and column = 
     * `col` is occupied by a star
     * 
     * @param row the row number
     * @param col the column number
     * @returns true if the cell contains a star
     */
    isStar(row : number, col : number) : boolean;

    /**
     * Returns true if cells position (row1, col1) and 
     * (row2, col2) are part of the same region     
     * 
     * @param row1 row number of the first cell
     * @param col1 column number of the first cell
     * @param row2 row number of the second cell
     * @param col2 column number of the second cell
     * @returns true if the two cells are in the same region
     */
    isSameRegion(row1 : number, col1: number, row2 : number, col2: number) : boolean;

    /**
     * Checks if there are exactly two cells at each region, each row,
     * and each column, and no two stars are in horizontally, vertically,
     * or diagonally adjacent cells.
     * 
     * @returns true if the game is complete, false otherwise
     */
    isComplete() : boolean;

    /**
     * Checks if the other puzzle has the same regions and stars at the same
     * positions.
     * 
     * @param other another Puzzle object
     * @returns true if the Puzzles are equal
     */
    equalValue(other : Puzzle): boolean;

    /**
     * Returns the string representation of the puzzle. The function
     * must satisfy the grammar specified at Grammar.ts
     * 
     * @returns the string representation of the board
     */
    format() : string;
}

// Consider making it an interface to make this type immutable as well
// interface Cell {
//     readonly row : number
//     readonly col : number
// };
type Cell = {
    row : number,
    col : number
};

class PuzzleRegionList implements Puzzle {

    private readonly rows : number;
    private readonly cols : number;
    private readonly regions : ReadonlyArray<ReadonlyArray<Cell>>;
    private readonly stars : ReadonlyArray<Cell>;

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

    public constructor (rows : number, cols : number, regions : Array<Array<Cell>>, stars : Array<Cell> = []) {
        // TODO defensively copy everything to the rep
        throw Error("Not implemented yet");
    }
    
    private checkRep() : void {
        // TODO
    }

    /**
     * @inheritdoc
     */
    public flip(row : number, col : number) : Puzzle {
        throw Error("Not implemented yet");
    }

    /**
     * @inheritdoc
     */
    public isStar(row: number, col: number): boolean {
        throw Error("Not implemented yet");
    }

    /**
     * @inheritdoc
     */
    public isSameRegion(row1: number, col1: number, row2: number, col2: number): boolean {
        throw Error("Not implemented yet");
    }

    /**
     * @inheritdoc
     */
    public isComplete(): boolean {
        throw Error("Not implemented yet");
    }

    /**
     * @inheritdoc
     */
    public equalValue(other: Puzzle): boolean {
        throw Error("Not implemented yet");    
    }

    /**
     * @inheritdoc
     */
    public format(): string {
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
export function makePuzzle(rep : string) : Puzzle {
    throw Error("Not implemented yet");
}