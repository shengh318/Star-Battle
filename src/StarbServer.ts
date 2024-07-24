/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.

import assert from 'assert';
import express, {Request, Response} from "express";
import HttpStatus from "http-status-codes";
import asyncHandler from "express-async-handler";
import fs from "fs";
import * as http from "http";
import {Puzzle} from "./Puzzle";
import {parse} from "./Parser";

const PORT = 8789;
const app = express();
/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789. To retrieve a specific puzzle, the name of the puzzle must
 * be specified using the `name` parameter.
 */
export async function startServer(): Promise<http.Server> {
    const server = app.listen(PORT);

    // Don't remove this. WebClient requires it
    // middleware taken from https://stackoverflow.com/questions/11181546/how-to-enable-cross-origin-resource-sharing-cors-in-the-express-js-framework-o
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.get('/', (request: Request, response: Response) => {
        response
            .status(HttpStatus.OK)
            .type('text')
            .send('Star Battle Puzzle Server');
    });

    app.get('/puzzles', asyncHandler(async (request: Request, response: Response) => {
        const puzzleFileName = request.query['name'];
        if (puzzleFileName !== undefined) {
            try {
                const puzzleFile = await fs.promises.readFile(`puzzles/${puzzleFileName}.starb`);
                const puzzle = parse(puzzleFile.toString());
                response
                    .status(HttpStatus.OK)
                    .type('text')
                    .send(puzzle.clearBoard().toString());
            } catch (e) {
                response
                    .status(HttpStatus.BAD_REQUEST)
                    .type('text')
                    .send("Invalid puzzle name");
            }
        } else {
            response
                .status(HttpStatus.BAD_REQUEST)
                .type('text')
                .send("Requires puzzle 'name' query parameter");
        }
    }));

    return server;
}

if (require.main === module) {
    void startServer();
}
