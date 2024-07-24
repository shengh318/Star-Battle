import { Parser, ParseTree, compile, visualizeAsUrl } from "parserlib";

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

enum BoardGrammar {
    Board,
    Size,
    StarCoords,
    RegionCoords,
    Number,
    Whitespace,
}

const parse: Parser<BoardGrammar> = compile(
    grammar,
    BoardGrammar,
    BoardGrammar.Board
);