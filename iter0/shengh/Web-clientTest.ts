import assert from "assert";
import { WebClient } from "./Web-Client";

describe("Web Client", function () {

    //Web Client testing strategy

    // Move:
    //      Partition on the item inside of the chosen location:
    //                          star
    //                          empty and is good to place a star in 
    //                          empty and is not good to place a star in: should throw error
    
    // checkWinGame:
    //      Partition on the state of the game: win, has not won yet

    // requestPuzzle:
    //      Partition on the board that has been parsed: Empty Board, Solved Board

    // drawBoard:
    //      Manual Test:
    //          1. Refresh the webpage for a new board
    //          3. Click out of the instructions page if we have one
    //          2. make a move on the new board
    //          -> the board should now be changed

    // giveInstructions:
    //      Manual Test:
    //          1. Refresh the webpage for a new board
    //          2. Request the server for a board
    //          -> Now the new board should have been loaded and the instructions on how to play
    //             the game should have popped up.


});