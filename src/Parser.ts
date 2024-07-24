import {Parser, ParseTree, compile} from "parserlib";
import { Puzzle, StarBattleCell, Position } from "./Puzzle";
import assert from "assert";

const grammar = `
@skip whitespace {
    starBattle ::= (comment newLine)* sizeExpression newLine ((region | comment) newLine)*;
    sizeExpression ::= number 'x' number comment?;
    region ::= (coordStar)* '|' (coord)* comment?;
    coordStar ::= number ',' number;
    coord ::= number ',' number;
    comment ::= '#' [^\\n]*;
}
number ::= [0-9]+;
whitespace ::= [ \\t\\r]+;
newLine ::= [\\n]+;
`;

enum StarBattleSymbols {
    StarBattle,
    Comment,
    SizeExpression,
    Region,
    CoordStar,
    Coord,
    Number,
    Whitespace,
    NewLine
}

const parser: Parser<StarBattleSymbols> = compile(grammar, StarBattleSymbols, StarBattleSymbols.StarBattle);

/**
 * Parse a string into a StarBattlePuzzle.
 *
 * @param input string to parse
 * @returns StarBattlePuzzle parsed from the string
 * @throws Error if the string doesn't match the Star Battle grammar.
 */
export function parse(input: string): Puzzle {
    const parseTree = parser.parse(input + '\n');

    const sizeExpression = parseTree.childrenByName(StarBattleSymbols.SizeExpression).at(0) ?? assert.fail();

    // get the dimensions
    const dims = sizeExpression
                    .childrenByName(StarBattleSymbols.Number)
                    .map(node => node.text)
                    .map(num => parseInt(num));
   
    // get the positions of the stars
    const stars = parseTree
                        .childrenByName(StarBattleSymbols.Region)
                        .flatMap(region => region.childrenByName(StarBattleSymbols.CoordStar));
    
    // get each individual regions as Array<Array<Position>>
    const regions = parseTree
                        .childrenByName(StarBattleSymbols.Region)
                        .map(region => region.children.filter(child => {
                            return child.name === StarBattleSymbols.Coord 
                                || child.name === StarBattleSymbols.CoordStar;
                        }))
                        .map(extractPositions);

    const [rows, cols] = dims;
    assert(rows !== undefined);
    assert(cols !== undefined);
    
    // create an empty board
    const board = new Array(rows).fill(0).map(row => new Array(cols).fill(0).map(
        col => {
            return {
                containsStar: false,
                regionId: 0
            };
        } 
    ));

    // puts stars on the empty board
    extractPositions(stars).map(position => {
        const boardRow = board[position.row - 1] ?? assert.fail();
        const boardCell = boardRow[position.col - 1] ?? assert.fail();
        boardCell.containsStar = true;
    });
    
    // assign regions on the empty board
    regions.map((region, i) => {
        region.map(position => {
            const boardRow = board[position.row - 1] ?? assert.fail();
            const boardCell = boardRow[position.col - 1] ?? assert.fail();
            boardCell.regionId = i;
        });
    });
    return new Puzzle(rows, cols, board);
}


/**
 * From an array of Coord or CoordStar nodes, extracts all positions of the coordinates
 * and returns them as an array of Position objects
 * 
 * @param line the array of Coord or CoordStar nodes representing the coordinates for a particular region
 * @returns an array of Position objects that represents the same coordinates as line
 */
function extractPositions(line : Array<ParseTree<StarBattleSymbols>>): Array<Position> {
    return line.map(coord => coord.childrenByName(StarBattleSymbols.Number))
               .map(node => node.map(number => parseInt(number.text)))
               .map(numbers => {
                    return {
                        row: numbers[0] ?? assert.fail(),
                        col: numbers[1] ?? assert.fail()
                    };
               });
}
