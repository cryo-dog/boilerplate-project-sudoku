class SudokuSolver {


  checkRowPlacement(puzzleString, row, column, value) {
      /*  (string) => (boolean)
          returns true if the number does not yet exist in the row.
       */
     let tempArray = this.stringToArray(puzzleString); // ["1",".","5", ...]
     let start = row * 9;
     let end = start + 9;
     return !tempArray.slice(start, end).some(valueArray => valueArray == value);
  }

  checkColPlacement(puzzleString, row, column, value) {
        /*  (string) => (boolean)
          returns true if the number does not yet exist in the column. 
        */
      let tempArray = this.stringToArray(puzzleString); // ["1",".","5",...]
      for (let index = column; index < 81; index += 9) {
          if (tempArray[index] == value) return false;
      }
      return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
      /*
      - find the top left corner of the region = topLeftIndex
      - start an outside loop starting with topLeftIndex and increment +2 times with +9
      - start an inside loop starting with the same index and increment +2 times with +1
      - check every time, if the value equals to the current value, return false if
      - in the end return true

      */
      let topLeftIndex = this.coordToPos(this.findTopLeftCorner(puzzleString, row, column, value));
      
      for (let indexOut = 0; indexOut < 3*9; indexOut+=9) {
          for (let indexIn = 0; indexIn < 3; indexIn++) {
              if (puzzleString[topLeftIndex + indexOut + indexIn] == value) return false;
          }
      }

      return true;
  }

  findTopLeftCorner(puzzleString, row, column, value) {
      // Returns the position of the top left corner of given row/col
      // e.g. r4 c3 v8 => r3 c3 
      let rowArea = Math.floor(row/3)*3;
      let colArea = Math.floor(column/3)*3;
      return [rowArea, colArea];
  }

  solve(puzzleString) {
    // Take the puzzleString, make an array out of it and use solveHelper to solve it.
    const puzzleArray = this.stringToArray(puzzleString);
    let solvedBoardArray = this.solveHelper(puzzleArray);
    return this.arrayToString(solvedBoardArray);
  }

  solveHelper(puzzleArray) {
      /* (array) => (array|boolean)
          Takes an array of 81 char longs and returns a solved soduko array or false if not solvable
          Strategy:
          - get coords of next "."
          + if no coords found, return board => you won, you are done! Base Case! (Last case!)
          - if coords found, continue with the coords
          - make a loop 1-9 and check if the value is valid
          - if you found one, add it to the puzzle and check if the puzzle is solvable with the new board
          - if you cannot find one, it doesn't solve the puzzle, so return false
          - if it is false, we need it to move on, which it does due to the incrementer
      */
      let puzzleString = this.arrayToString(puzzleArray);
      let nextPos = this.findNext(puzzleString); // returns -1 or [row, col]
      if (nextPos == -1) return true;
      let nextCoords = this.posToCoord(nextPos); // returns num


      for (let testNum = 1; testNum <= 9; testNum++) {
          let isValidValue = this.posValidation(puzzleString, nextCoords[0], nextCoords[1], testNum);
          //console.log('Testing pos: ', nextPos, ". Testin with #", testNum, ". Coords: ", nextCoords);
          if (isValidValue) {
              puzzleArray[nextPos] = testNum;
              // puzzle solvable with updated puzzleArray?
              if (this.solveHelper(puzzleArray)) {
                  return puzzleArray;
              } 
              puzzleArray[nextPos] = ".";
          } 
      }

      return false;
  }

  posValidation(puzzleString, row, column, value) {
      if (
      this.checkColPlacement(puzzleString, row, column, value) &&
      this.checkRowPlacement(puzzleString, row, column, value) &&
      this.checkRegionPlacement(puzzleString, row, column, value)) {
          return true;
      } else {
          return false;
      }
  }

  posToCoord(position) {
      // The posToCoord function should take a given position and convert it to an array of coordinates.
      const row = Math.floor(position / 9);
      const column = position % 9;
      return [row, column];
  }

  coordToPos(rowTemp, column = 0) {
      // (row, col) or ([row, col]) => (position) 
      let row;
      if (typeof(rowTemp) == "object") {
          row = rowTemp[0];
          column = rowTemp[1];
      } else {
          row = rowTemp;
      }
      return (row * 9) + column;
  }

  findNext(puzzleString, searcher = ".") {
      // (string) => (position)
      // The findNextZero function should take a given puzzle string and find the next zero in the puzzle string.
      return puzzleString.split("").findIndex(elem => elem == searcher );
  }

  stringToArray(boardString) {
      // Gets a 81 char long string and converts it to an array of 81 char longs.
      return boardString.split("") //.map(char => char.charCodeAt(0));
  }

  arrayToString(boardArray) {
      // Converts an array of 81 char longs to a 81 char long string.
      if (!boardArray) return boardArray;
      return boardArray.join("");
  }

  validate(puzzleString) {
      // The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input.
      if (puzzleString.length === 81 && puzzleString.match(/^[1-9.]+$/)[0].length === 81) {
        if ( this.showDetails ) console.log("Tested string validity: Valid puzzle string");
        return true;
      } else {
        if ( this.showDetails ) console.log("Tested string validity: Invalid puzzle string");
        return false;
      };
    }

}

//const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"
const puzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"

const solved = "534678912672195348198342567859761423426853791713924856961537284287419635345286179"

const sudokuBoard = new SudokuSolver();

let solvedPuzzle = sudokuBoard.solve(puzzleString);


/* puzzleString as SodukoBoard
  cols    cols    cols
 | 0 1 2 | 3 4 5 | 6 7 8 
--|-------|-------|------
r0 | 5 3 . | . 7 . | . . . 
r1 | 6 . . | 1 9 5 | . . . 
r2 | . 9 8 | . . . | . 6 . 
--|-------|-------|------
r3 | 8 . . | . 6 . | . . 3   r3 c6 p33
r4 | 4 . . | 8 . 3 | . . 1 
r5 | 7 . . | . 2 . | . . 6   r5 p8 p53 
--|-------|-------|------
r6 | . 6 . | . . . | 2 8 . 
r7 | . . 1 | 4 1 9 | . . 5 
r8 | . . 4 | . 8 . | . 7 9 
rows

*/


module.exports = SudokuSolver;

