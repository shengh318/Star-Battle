"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const app = (0, express_1.default)();
// GET /echo
//
// demo api to test if the server is running
app.get('/echo', (request, response) => {
    response
        .status(http_status_codes_1.default.OK)
        .type('text')
        .send('Hello!!');
});
// GET /getpuzzle
//
// Requests the server to send an empty puzzle in the specified string format
app.get('/getpuzzle', (0, express_async_handler_1.default)(async (request, response) => {
    throw Error("Not implemented yet");
}));
/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main() {
    // designated port for the project (don't change)
    const PORT = 8789;
    app.listen(PORT);
    console.log('Server running at port', PORT);
}
if (require.main === module) {
    void main();
}
//# sourceMappingURL=WebAPI.js.map