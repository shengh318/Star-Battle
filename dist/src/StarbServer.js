"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const fs_1 = __importDefault(require("fs"));
const Parser_1 = require("./Parser");
const PORT = 8789;
const app = (0, express_1.default)();
/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789. To retrieve a specific puzzle, the name of the puzzle must
 * be specified using the `name` parameter.
 */
async function startServer() {
    const server = app.listen(PORT);
    // Don't remove this. WebClient requires it
    // middleware taken from https://stackoverflow.com/questions/11181546/how-to-enable-cross-origin-resource-sharing-cors-in-the-express-js-framework-o
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
    app.get('/', (request, response) => {
        response
            .status(http_status_codes_1.default.OK)
            .type('text')
            .send('Star Battle Puzzle Server');
    });
    app.get('/puzzles', (0, express_async_handler_1.default)(async (request, response) => {
        const puzzleFileName = request.query['name'];
        if (puzzleFileName !== undefined) {
            try {
                const puzzleFile = await fs_1.default.promises.readFile(`puzzles/${puzzleFileName}.starb`);
                const puzzle = (0, Parser_1.parse)(puzzleFile.toString());
                response
                    .status(http_status_codes_1.default.OK)
                    .type('text')
                    .send(puzzle.clearBoard().toString());
            }
            catch (e) {
                response
                    .status(http_status_codes_1.default.BAD_REQUEST)
                    .type('text')
                    .send("Invalid puzzle name");
            }
        }
        else {
            response
                .status(http_status_codes_1.default.BAD_REQUEST)
                .type('text')
                .send("Requires puzzle 'name' query parameter");
        }
    }));
    return server;
}
exports.startServer = startServer;
if (require.main === module) {
    void startServer();
}
//# sourceMappingURL=StarbServer.js.map