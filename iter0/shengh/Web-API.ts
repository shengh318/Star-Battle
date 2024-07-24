import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const app = express();


// get the puzzle from the server
// gets the requested puzzle string from the server for the parse to parse into a board
// the string returned will have a specific format detailed in the project handout

app.get('/getPuzzle', asyncHandler(async (request: Request, response: Response) => {
    throw new Error ("Not implemented yet");
}));


/**
 * Start a server on port 8789 which the client will be listening to in order to start playing the game.
 */
async function main(): Promise<void> {
    const listenPort= 8789;
    app.listen(listenPort);
    console.log(`${listenPort} connection has been established.`);
}

if (require.main === module) {
    void main();
}