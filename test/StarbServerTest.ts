/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This test file runs in Node.js, see the `npm test` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.
// See the *Testing* section of the project handout for more advice.

import assert from 'assert';
import {startServer} from '../src/StarbServer';
import fetch from "node-fetch";
import HttpStatus from "http-status-codes";
import fs from "fs";

import {parse} from "../src/Parser";

const PORT = 8789;
describe('StarbServer', function() {
    /**
     * Testing strategy: partition on supported paths
     *      / (root): should work
     *      /puzzles: partition on query parameter 'name'
     *          name not present/ name invalid puzzle/ name valid puzzle
     */

    it('root directory should return message indicating server liveness (skip Didit)', async function () {
        const server = await startServer();

        const url = `http://localhost:${PORT}/`;
        const response = await fetch(url);
        assert.strictEqual(response.status, HttpStatus.OK, "server should support root directory get");
        assert((await response.text()).length > 0, "server should return some message");

        void server.close();
    });

    it('puzzles directory: server should return error if name parameter not specified (skip Didit)', async function () {
        const server = await startServer();

        const url = `http://localhost:${PORT}/puzzles`;
        const response = await fetch(url);
        assert.strictEqual(response.status, HttpStatus.BAD_REQUEST, "server should return bad request");
        assert((await response.text()).length > 0, "server should return some message");

        void server.close();
    });

    it('puzzles directory: server should return error on invalid puzzle name (skip Didit)', async function () {
        const server = await startServer();

        const url = `http://localhost:${PORT}/puzzles?name=`;
        const response = await fetch(url);
        assert.strictEqual(response.status, HttpStatus.BAD_REQUEST, "server should return bad request");
        assert((await response.text()).length > 0, "server should return some message");

        void server.close();
    });

    it('puzzles directory: server should return blank puzzle text on valid query (skip Didit)', async function () {
        const server = await startServer();

        for (const file of ['kd-1-1-1', 'kd-6-31-6']) {
            const url = `http://localhost:${PORT}/puzzles?name=${file}`;
            const response = await fetch(url);
            assert.strictEqual(response.status, HttpStatus.OK, "server should succeed");

            const fileText = (await fs.promises.readFile(`puzzles/${file}.starb`)).toString();
            assert.strictEqual(parse(fileText).clearBoard().toString(), await response.text());
        }
        void server.close();
    });
});
