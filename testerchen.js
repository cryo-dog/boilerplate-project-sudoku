class SudokuSolver {

    validate(puzzleString) {
      // The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input.
      if (puzzleString.length === 81 && puzzleString.match(/^[1-9.]+$/)[0].length === 81) {
        console.log("Tested string validity: Valid puzzle string");
        return true;
      } else {
        console.log("Tested string validity: Invalid puzzle string");
        return false;
      };
    }

    posToCoord(position) {
        // The posToCoord function should take a given position and convert it to an array of coordinates.
        const row = Math.floor(position / 9);
        const column = position % 9;
        return [row, column];
    }

    coordToPos(row, column) {
        // The coordToPos function should take a given row and column and convert it to a position.
        return (row * 9) + column;
    }

    findNextZeroString(puzzleString) {
        // (string) => (position)
        // The findNextZero function should take a given puzzle string and find the next zero in the puzzle string.
        return puzzleString.split("").find(elemenet => elemenet === ".");
    }
  
    checkRowPlacement(puzzleString, row, column, value) {
      // Check if the number already exists in the given row. Function returns true if the number already exists, false otherwise.
      const puzzleArray = this.createRows(puzzleString);
      if (puzzleArray[row][column] == value) { // Number already exists
        console.log("Tested row placement: Number already exists at coordinates");
        return true
      }; 

      if ( puzzleArray[row].some((arrayValues) => arrayValues == value) ) { // Row testing
        console.log("Tested row placement: Number exists in row");
        return false;
      } else {
        console.log("Tested row placement: Number does not exist in row");
        return true;
      };

    }
  
    checkColPlacement(puzzleString, row, column, value) {
        let inIndex = row;
        let outIndex = column;
        const puzzleArray = this.createColumns(puzzleString);
        console.log(`Number at colArray coordinates: ${puzzleArray[row][inIndex]}`);
        if (puzzleArray[outIndex][inIndex] == value) { // Number already exists
          console.log("Tested col placement: Number already exists at coordinates");
          return true
        }; 
  
        if ( puzzleArray[row].some((arrayValues) => arrayValues == value) ) { // Row testing
          console.log("Tested col placement: Number exists in col");
          return false;
        } else {
          console.log("Tested col placement: Number does not exist in row");
          return true;
        };
    }
  
    checkRegionPlacement(puzzleString, row, column, value) {
        const puzzleArray = this.createRows(puzzleString); // Creates a 2d array of rows
        
        // Calculate top left corner of a 3x3 box
        const boxRow = Math.floor(row/3) * 3;
        const boxColumn = Math.floor(column / 3) * 3;

        // Quick check if the number already exists in the given coordinates
        if (puzzleArray[row][column] == value) { 
            console.log("Tested region placement: Number already exists at coordinates");
            return true;
        };


        let counter = 0; // Tests how often something appears in the box

        // Check if the value appears in the box
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxColumn; j < boxColumn + 3; j++) {
                if (puzzleArray[i][j] == value) {  // Same number on spot
                        console.log(`Tested box placement: Number already exists in box at row: ${i + 1} and col: ${j + 1}`);
                        return false;
                };

            }    
        }
        console.log("Tested box placement: Number does not exist in box");
        return true;
    }
  
    solve(puzzleString) {
      // Create 2D-Array of rows and columns
      if (!this.validate(puzzleString)) {
        return "Invalid puzzle string";
      }

      const mainPuzzleArray = this.createRows(puzzleString);
      const solvedArray = this.solveHelper(mainPuzzleArray);

      
        if (!solvedArray) {
            return "Unable to solve puzzle";
        }

        const solvedString = this.createString(solvedArray);

        return solvedString;


    }

    solveHelper(mainPuzzleArray) {
        const [col, row] = this.findNextDot(mainPuzzleArray);

        if (col === -1 && row === -1) {
            return puzzleArray;
        }

        for (let num = 1; num <= 9 ; num++) {
            
            if (
                this.checkRowPlacement(this.createString(mainPuzzleArray), row, col, num) &&
                this.checkColPlacement(this.createString(mainPuzzleArray), row, col, num) &&
                this.checkRegionPlacement(this.createString(mainPuzzleArray), row, col, num)
            ) {
                // All checks passed
                console.log(`All checks passed for number: ${num} at location ${row}, ${col}`);
                mainPuzzleArray[row][col] = num;

                const solvedArray = this.solveHelper(mainPuzzleArray);

                if (solvedArray) {
                    console.log(`Puzzle solved fully!!!`);
                    return solvedArray;
                }

                puzzleArray[row][col] = ".";

            }
           
        }
        return false;
    }


      // Get the next dot location. If it is [-1,-1] then the puzzle is solved and we exit! 
      // Make a loop going from 1-9
      // 



    findNextDot(puzzleString) {
        // Finds the next puzzle dot and returns its coordinates as array
        let puzzleStringFlatArray;

        if (typeof puzzleString == "string") {
            puzzleStringFlatArray = puzzleString.split("");
        } else {
            puzzleStringFlatArray = this.createString(puzzleString).split("");
            console.log("Puzzle string is not a string");
        }
        //console.log('Puzzle string flat array: ', puzzleStringFlatArray);
        let flatLocation = puzzleStringFlatArray.indexOf(".");
        //console.log('Location of next dot: ', flatLocation);
        let col = flatLocation % 9;
        let row = Math.floor(flatLocation / 9);

        return [col,row]; // [-1, -1] when puzzle is solved!
    }

    createString(puzzleArray) {
        let puzzleString = "";
      
        for (let i = 0; i < 9; i++) {
          puzzleString += puzzleArray[i].join("");
        }
      
        return puzzleString;
      }
  
    createRows(puzzleString) {
        
        let i = 0;
        const lines = Math.sqrt(puzzleString.length);
       // console.log(`Lines: ${lines}`);
        let rowArray = [];
        let columnArray = [];
        let pushArray = [];

        for (let y = 0; y < lines; y++) {
           for (let x = 0; x < lines; x++) {
            pushArray.push(puzzleString[i]);
            // console.log(`Value at i ${i} is ${puzzleString[i]}`);
            i++;
           }
           rowArray.push(pushArray);
           pushArray = [];
        }
        return rowArray;
        // Returning array is: rowArray[y][x]
    }

    createColumns(puzzleString) {
        let rowArray = this.createRows(puzzleString);
        let lines = rowArray.length;
        let columnArray = [];
        let pushArray = [];

        for (let a = 0; a < lines; a++) {
            
            for (let b = 0; b < lines; b++) {
                pushArray.push(rowArray[b][a]);
            }
            columnArray.push(pushArray);
            pushArray = [];
        }
        return columnArray;
    }

}  

  
  
  let validDotString = "7.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  let invalidDotString = "76923541885.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const puzzle = new SudokuSolver();


  const resulter = puzzle.solve(validDotString);
  console.log(resulter);