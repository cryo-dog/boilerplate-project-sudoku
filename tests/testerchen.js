function validateCurrentBoard(currentBoardString) {
    let currentBoardArray = currentBoardString.split("");
    let boardObj = {}
    for (let index = 0; index < 81; index++) {
      if (!(currentBoardArray[index] == ".")) {
        boardObj[index] = currentBoardArray[index];
      }
      
    }
    return boardObj;
  }

let validPuzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let validUnsolvablePuzzleString = "..9.25.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

let validButDoublePuzzleString = ".99..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

let tooLongValidPuzzleString = "5...3.3..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let invalidPuzzleString = "53x.7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let solvedValidPuzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";


console.log(validateCurrentBoard(validPuzzleString));