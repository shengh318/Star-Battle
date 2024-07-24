"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebClient = void 0;
class WebClient {
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
    constructor(puzzleString) {
        throw new Error("Not implemented yet!");
    }
    /**
     * @inheritdoc
     */
    requestPuzzle(puzzleFile) {
        throw new Error("Not implemented yet!");
    }
    /**
     * @inheritdoc
     */
    move(chosenLocation) {
        throw new Error("Not implemented yet!");
    }
    /**
     * @inheritdoc
     */
    checkWinGame() {
        throw new Error("Not implemented yet!");
    }
    /**
     * @inheritdoc
     */
    drawBoard() {
        throw new Error("Not implemented yet!");
    }
    /**
     * @inheritdoc
     */
    giveInstructions() {
        throw new Error("Not implemented yet!");
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=Web-client.js.map