import assert from "assert";
import { Board ,Location } from "./Board";


/**
 * A web client which contains a board that obeys the 2 star StarBattle game rules where the board size
 * is always 10 rows x 10 cols and each board that the client is playing on has a unique solution.
 */
interface Client{

    /**
     * @returns the number of rows the board contains
     *          the number of cols the board contains
     *          the current state of the board
     */
    readonly row: number;
    readonly col: number;
    readonly board: Board;
    readonly puzzleFile: string;


    /**
     * Given a puzzleFile name, the client will request this puzzle file name 
     * from the server and when returned, will parse the given file and set the
     * instance variable board to the parsed board.
     * 
     * @param puzzleFile the puzzle file name that you want to request from the server
     * @returns a board that has been parsed from the returned file. 
     */
    requestPuzzle(puzzleFile: string): Board;

    /**
     * Given a valid position on the board,
     *              if that position has a star
     *                      take away the star
     *              if that position is empty
     *                      throw error if the game rule has been violated
     *                      other wise add a star to that location
     * 
     * @param chosenLocation the location chosen by the player
     */
    move(chosenLocation: Location): void;

    /**
     * Looks at the current state of the board and determine if the game is already
     * at a winning state or not. If the game is already won, will inform the player on the webpage
     * that the board is already at its winning state. 
     * 
     * @returns true if the board has already been won
     *          false otherwise
     */
    checkWinGame(): boolean;

    /**
     * Draws the current state of the board onto a Canvas on the webpage.
     */
    drawBoard(): void;

    /**
     * Gives the instruction of how to play the game on the webpage before the game starts.
     */
    giveInstructions(): void;
}

export class WebClient implements Client{
    public readonly row: number;
    public readonly col: number;
    public readonly board: Board;
    public readonly puzzleFile: string;

    // Abstract function(puzzleFile): a WebClient that requests the puzzleFile from the server
    //                                  parses the returned text .starb file to turn it into a startingBoard.
    //                                   the starting board obeys the 2 star StarBattle rules

    // Rep Invariant:
    //      -> the board has 10 rows
    //      -> the board has 10 cols

    // Safety from Rep Exposure:
    //          All instance variables who are public readonly are immutable ADTs

    //          All public functions do not mutate anything and if passed in a mutable
    //          object, it will create a defensive copy and use that defensive copy
    //          instead of the one passed into the argument

    //          All public functions return immutable objects.


    /**
     * Creates a starting board for the WebClient ADT 
     * 
     * @param puzzleString the string that you want to request from the server to give 
     *        you a corresponding text file of that puzzle file.
     */
    public constructor(puzzleString: string){
        throw new Error("Not implemented yet!");
    }

    /**
     * @inheritdoc
     */
    public requestPuzzle(puzzleFile: string): Board{
        throw new Error("Not implemented yet!");
    }

    /**
     * @inheritdoc
     */
    public move(chosenLocation: Location): void {
        throw new Error("Not implemented yet!");
    }

    /**
     * @inheritdoc
     */
    public checkWinGame(): boolean {
        throw new Error("Not implemented yet!");
    }

    /**
     * @inheritdoc
     */
    public drawBoard(): void {
        throw new Error("Not implemented yet!");
    }
    
    /**
     * @inheritdoc
     */
    public giveInstructions(): void {
        throw new Error("Not implemented yet!");
    }

}