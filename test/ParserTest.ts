import assert from "assert";
import { parse } from "../src/Parser";
import fs from "fs";

describe('Parser', function () {
    it('covers file 1', async function() {
        const file = await fs.promises.readFile("puzzles/kd-1-1-1.starb", { encoding: 'utf8' });
        const board = parse(file);
        assert.ok(board.isSolved());
        assert.deepStrictEqual(board.getCell({ row: 0, col: 1 }), { containsStar: true, regionId: 0 });
        assert.deepStrictEqual(board.getCell({ row: 2, col: 2 }), { containsStar: false, regionId: 2 });
    });
    it('covers file 2', async function () {
        const file = await fs.promises.readFile("puzzles/kd-6-31-6.starb", { encoding: 'utf8' });
        const board = parse(file);

        //this board is not solved!
        assert.ok(!board.isSolved());
        assert.deepStrictEqual(board.getCell({ row: 6, col: 7 }), { containsStar: false, regionId: 8 });
        assert.deepStrictEqual(board.getCell({ row: 8, col: 6 }), { containsStar: true, regionId: 9 });
    });
});
