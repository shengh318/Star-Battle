Manual Test Plan for Integration:
* Covers server connectivity:
  * Assert that localhost:8789 connects.


* Covers server api:
  * Assert that visiting the localhost:8789/getPuzzle (with appropriate params) returns text of the right puzzle in the defined grammar. 


* Covers client integration with server:
  * Assert opening client displays a blank puzzle grid with defined regions and squares.


* Covers client interaction:
  * Assert clicking on a square results in the square being visually marked with a star, if doing so results in a valid puzzle state.
  * Assert clicking on a square doesn't result in the square being visually marked with a star, if doing so results in an invalid puzzle state.
  * Assert clicking on a square visually marked with a star removes the visual indicator of the star.
  * Assert that upon the puzzle becoming solved, a message is displayed that indicates this.
