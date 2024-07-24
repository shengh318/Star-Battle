import {Parser, ParseTree, compile} from "parserlib";
import {StarBattlePuzzle} from "./StarBattlePuzzle";

const grammar = `
@skip whitespace {
    starBattle ::= (comment '\\n')* '\\n' sizeExpression '\\n' '|' (region '\\n')*;
    comment ::= '#' [^\\n]*;
    sizeExpression ::= number 'x' number;
    region ::= (coord)* '|' (coord)*;
    coord ::= number ',' number;
}
number ::= [0-9]+;
whitespace ::= [ \\t\\r]+;
`;

enum StarBattleSymbols {
    StarBattle,
    Comment,
    SizeExpression,
    Region,
    Coord,
    Number,
    Whitespace,
}

const parser: Parser<StarBattleSymbols> = compile(grammar, StarBattleSymbols, StarBattleSymbols.StarBattle);

/**
 * Parse a string into a StarBattlePuzzle.
 *
 * @param input string to parse
 * @returns StarBattlePuzzle parsed from the string
 * @throws ParseError if the string doesn't match the Star Battle grammar.
 */
export function parse(input: string): StarBattlePuzzle {
    throw new Error("Not implemented");
}