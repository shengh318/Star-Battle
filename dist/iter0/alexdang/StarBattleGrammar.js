"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parserlib_1 = require("parserlib");
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
var StarBattleSymbols;
(function (StarBattleSymbols) {
    StarBattleSymbols[StarBattleSymbols["StarBattle"] = 0] = "StarBattle";
    StarBattleSymbols[StarBattleSymbols["Comment"] = 1] = "Comment";
    StarBattleSymbols[StarBattleSymbols["SizeExpression"] = 2] = "SizeExpression";
    StarBattleSymbols[StarBattleSymbols["Region"] = 3] = "Region";
    StarBattleSymbols[StarBattleSymbols["Coord"] = 4] = "Coord";
    StarBattleSymbols[StarBattleSymbols["Number"] = 5] = "Number";
    StarBattleSymbols[StarBattleSymbols["Whitespace"] = 6] = "Whitespace";
})(StarBattleSymbols || (StarBattleSymbols = {}));
const parser = (0, parserlib_1.compile)(grammar, StarBattleSymbols, StarBattleSymbols.StarBattle);
/**
 * Parse a string into a StarBattlePuzzle.
 *
 * @param input string to parse
 * @returns StarBattlePuzzle parsed from the string
 * @throws ParseError if the string doesn't match the Star Battle grammar.
 */
function parse(input) {
    throw new Error("Not implemented");
}
exports.parse = parse;
//# sourceMappingURL=StarBattleGrammar.js.map