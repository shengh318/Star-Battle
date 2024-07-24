"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const app = (0, express_1.default)();
// get the puzzle from the server
// gets the requested puzzle string from the server for the parse to parse into a board
// the string returned will have a specific format detailed in the project handout
app.get('/getPuzzle', (0, express_async_handler_1.default)(async (request, response) => {
    throw new Error("Not implemented yet");
}));
/**
 * Start a server on port 8789 which the client will be listening to in order to start playing the game.
 */
async function main() {
    const listenPort = 8789;
    app.listen(listenPort);
    console.log(`${listenPort} connection has been established.`);
}
if (require.main === module) {
    void main();
}
//# sourceMappingURL=Web-API.js.map