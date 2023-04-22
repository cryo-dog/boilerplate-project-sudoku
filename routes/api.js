'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

function coordTranslator (coords) { // coords comes e.g. as "C1" RowCol
  let returner;
  if (coords.length != 2) return false;
  let row = coords[0];
  let col = parseInt( coords[1] );
  col = col - 1;
  if (col < 0 || col > 8) {
    console.error("Invalid column: " + col);
    return false;
  }
  row = row.toUpperCase();
  switch (row) {
    case "A":
      row = 0;
      break;
    case "B":
      row = 1;
      break;
    case "C":
      row = 2;
      break;
    case "D":
      row = 3;
      break;
    case "E":
      row = 4;
      break;
    case "F":
      row = 5;
      break;  
    case "G":
      row = 6;
      break;
    case "H":
      row = 7;
      break;
    case "I":
      row = 8;
      break;  
    default:
      console.error("Invalid row: " + row);
      return false;
      break;
  }
  return [row, col];
}


module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      /* Check if the given value and coordinates are valid
      - deconstruct coordinates: C1 => row 2, col 0
      - use class function to check if the value is valid
        - One call per check and a first empty array which grows with every error
      - return true if array stays empty otherwise return false and array

      { "valid": true }
      { "valid": false, "conflict": [ "region" ] }
      { "valid": false, "conflict": [ "column", "region" ] }
      { "valid": false, "conflict": [ "row", "column", "region" ] }

      Example request:
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'a2',
        value: '3'
      */

        if (
          !req.body.hasOwnProperty("puzzle") |
          !req.body.hasOwnProperty("coordinate") |
          !req.body.hasOwnProperty("value")) {
            console.error("Value is missing");
            res.json({"error": "Required field(s) missing"});
            return;
        }
        
      const {puzzle, coordinate, value} = req.body;

      if ((parseInt(value) < 1) || (parseInt(value) > 9) || parseInt(value) != value) {
        console.error("Value is not an integer or outside range");
        res.json({"error": "Invalid value"});
        return;
      }

      if (puzzle.length!= 81) {
        console.error("Invalid puzzle length: ", puzzle.length);
        res.json({"error": "Expected puzzle to be 81 characters long"});
        return;
      }

      if (!solver.validate(puzzle)) {
        console.error("Invalid puzzle: ", puzzle);
        res.json({"error": "Invalid characters in puzzle"});
        return;
      }

      let coordinatesTranslated = coordTranslator(coordinate);
      if (!coordinatesTranslated) {
        console.error("Invalid coordinate: ", coordinate);
        res.json({"error": "Invalid coordinate"});
        return;
      }

      console.log("Testing values at ", coordinate, " translated to ", coordinatesTranslated,  " with value", value);

      let errorArray = [];
      if (!solver.checkRowPlacement(puzzle, coordinatesTranslated[0], coordinatesTranslated[1], value)) errorArray.push("row");
      if (!solver.checkColPlacement(puzzle, coordinatesTranslated[0], coordinatesTranslated[1], value)) errorArray.push("column");
      if (!solver.checkRegionPlacement(puzzle, coordinatesTranslated[0], coordinatesTranslated[1], value)) errorArray.push("region");

      // Get position from coordinates and compare value
      let positionTranslated = solver.coordToPos(coordinatesTranslated);
      let sameValueAtPosition = value == puzzle[positionTranslated];

      if (errorArray.length == 0 || sameValueAtPosition) {
        console.log("All seems valid at");
        res.json({valid: true});
      } else {
        console.log("Error found", errorArray);
        res.json({valid: false, conflict: errorArray});
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle;
      if (req.body.hasOwnProperty("puzzle")) {
        puzzle = req.body.puzzle; // Puzzle String "..9.434.2..." length 81
      } else {
        console.log("No puzzle given");
        res.json({"error": "Required field missing"});
        return;
      }
      // Error cases
      if (puzzle.length!= 81) {
        console.error("Invalid puzzle length: ", puzzle.length);
        res.json({"error": "Expected puzzle to be 81 characters long"});
        return;
      }

      if (!solver.validate(puzzle)) {
        console.error("Invalid puzzle: ", puzzle);
        res.json({"error": "Invalid characters in puzzle"});
        return;
      }

      let solution = solver.solve(puzzle);
      if (solution) {
        console.log("solved puzzle: ", solution);
        res.json({"solution": solution});
      } else {
        console.log("No solution found; function returns false");
        res.json({"error": "Puzzle cannot be solved"});
      }
    });
};
