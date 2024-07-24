"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Parser_1 = require("../src/Parser");
const fs_1 = __importDefault(require("fs"));
describe('Parser', function () {
    it('covers file 1', async function () {
        const file = await fs_1.default.promises.readFile("puzzles/kd-1-1-1.starb", { encoding: 'utf8' });
        const board = (0, Parser_1.parse)(file);
        assert_1.default.ok(board.isSolved());
        assert_1.default.deepStrictEqual(board.getCell({ row: 0, col: 1 }), { containsStar: true, regionId: 0 });
        assert_1.default.deepStrictEqual(board.getCell({ row: 2, col: 2 }), { containsStar: false, regionId: 2 });
    });
    it('covers file 2', async function () {
        const file = await fs_1.default.promises.readFile("puzzles/kd-6-31-6.starb", { encoding: 'utf8' });
        const board = (0, Parser_1.parse)(file);
        //this board is not solved!
        assert_1.default.ok(!board.isSolved());
        assert_1.default.deepStrictEqual(board.getCell({ row: 6, col: 7 }), { containsStar: false, regionId: 8 });
        assert_1.default.deepStrictEqual(board.getCell({ row: 8, col: 6 }), { containsStar: true, regionId: 9 });
    });
});
//# sourceMappingURL=ParserTest.js.map