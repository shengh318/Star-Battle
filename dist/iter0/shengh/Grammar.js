"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parserlib_1 = require("parserlib");
const grammar = `
@skip whitespace{
    board ::= size (starCoords)* '|' (regionCoords)*
    size ::= number 'x' number;
    starCoords ::= number 'x' number;
    regionCoords ::= number 'x' number;
}

number ::= [0-9]+;
whitespace ::= [ \\t\\r\\n]+;
`;
var BoardGrammar;
(function (BoardGrammar) {
    BoardGrammar[BoardGrammar["Board"] = 0] = "Board";
    BoardGrammar[BoardGrammar["Size"] = 1] = "Size";
    BoardGrammar[BoardGrammar["StarCoords"] = 2] = "StarCoords";
    BoardGrammar[BoardGrammar["RegionCoords"] = 3] = "RegionCoords";
    BoardGrammar[BoardGrammar["Number"] = 4] = "Number";
    BoardGrammar[BoardGrammar["Whitespace"] = 5] = "Whitespace";
})(BoardGrammar || (BoardGrammar = {}));
const parse = (0, parserlib_1.compile)(grammar, BoardGrammar, BoardGrammar.Board);
//# sourceMappingURL=Grammar.js.map