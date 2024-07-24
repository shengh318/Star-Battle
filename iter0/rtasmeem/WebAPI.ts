/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.

import express, { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import asyncHandler from 'express-async-handler';

const app = express();

// GET /echo
//
// demo api to test if the server is running

app.get('/echo', (request : Request, response : Response) => {
    response
        .status(HttpStatus.OK)
        .type('text')
        .send('Hello!!');
});


// GET /getpuzzle
//
// Requests the server to send an empty puzzle in the specified string format

app.get('/getpuzzle', asyncHandler(async (request : Request, response : Response) => {
    throw Error("Not implemented yet");
}));


/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main(): Promise<void> {
    // designated port for the project (don't change)
    const PORT = 8789;
    app.listen(PORT);
    console.log('Server running at port', PORT);
}

if (require.main === module) {
    void main();
}
