import assert from 'assert';
import { WebClient } from '../src/WebClient'
import { startServer } from "../src/StarbServer"
import { Canvas, createCanvas } from 'canvas';

describe('Manual Testing for WebClient', function () {
    // Testing strategy
    // 
    // 1) Tests request() constructor using files from puzzles/
    //
    // Manual testing strategy:
    //
    // step 1: npm run server 
    // step 2: npm run watchify-client
    //
    // This is start the server and the client
    // Now open up the HTML file starb-client.html
    //
    // Click on cell at row 1 column 1. 
    // Open up the console, you should see 0, 0 in the console (0 based indexing)
    //
    // Now click on the cell at roe 2, column 5
    // you should see see 1, 4 on the console
    //
    
    const PORT = 8789;

    it.skip('covers file kd-1-1-1 (skip Didit)', async function () {
        const server = await startServer();
        const canvas = createCanvas(10, 10);
        const webclient = await WebClient.request("kd-1-1-1", canvas);
        assert.strictEqual(webclient.isBoardSolved(), false, 'board is empty');
        server.close();
    });
});
