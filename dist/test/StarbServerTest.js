"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This test file runs in Node.js, see the `npm test` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.
// See the *Testing* section of the project handout for more advice.
const assert_1 = __importDefault(require("assert"));
const StarbServer_1 = require("../src/StarbServer");
const node_fetch_1 = __importDefault(require("node-fetch"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const fs_1 = __importDefault(require("fs"));
const Parser_1 = require("../src/Parser");
const PORT = 8789;
describe('StarbServer', function () {
    /**
     * Testing strategy: partition on supported paths
     *      / (root): should work
     *      /puzzles: partition on query parameter 'name'
     *          name not present/ name invalid puzzle/ name valid puzzle
     */
    it('root directory should return message indicating server liveness (skip Didit)', async function () {
        const server = await (0, StarbServer_1.startServer)();
        const url = `http://localhost:${PORT}/`;
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(response.status, http_status_codes_1.default.OK, "server should support root directory get");
        (0, assert_1.default)((await response.text()).length > 0, "server should return some message");
        void server.close();
    });
    it('puzzles directory: server should return error if name parameter not specified (skip Didit)', async function () {
        const server = await (0, StarbServer_1.startServer)();
        const url = `http://localhost:${PORT}/puzzles`;
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(response.status, http_status_codes_1.default.BAD_REQUEST, "server should return bad request");
        (0, assert_1.default)((await response.text()).length > 0, "server should return some message");
        void server.close();
    });
    it('puzzles directory: server should return error on invalid puzzle name (skip Didit)', async function () {
        const server = await (0, StarbServer_1.startServer)();
        const url = `http://localhost:${PORT}/puzzles?name=`;
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(response.status, http_status_codes_1.default.BAD_REQUEST, "server should return bad request");
        (0, assert_1.default)((await response.text()).length > 0, "server should return some message");
        void server.close();
    });
    it('puzzles directory: server should return blank puzzle text on valid query (skip Didit)', async function () {
        const server = await (0, StarbServer_1.startServer)();
        for (const file of ['kd-1-1-1', 'kd-6-31-6']) {
            const url = `http://localhost:${PORT}/puzzles?name=${file}`;
            const response = await (0, node_fetch_1.default)(url);
            assert_1.default.strictEqual(response.status, http_status_codes_1.default.OK, "server should succeed");
            const fileText = (await fs_1.default.promises.readFile(`puzzles/${file}.starb`)).toString();
            assert_1.default.strictEqual((0, Parser_1.parse)(fileText).clearBoard().toString(), await response.text());
        }
        void server.close();
    });
});
//# sourceMappingURL=StarbServerTest.js.map