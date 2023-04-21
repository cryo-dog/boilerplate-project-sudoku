const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let tooLongValidPuzzleString = "5...3.3..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let invalidPuzzleString = "53x.7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let solvedValidPuzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

suite('Unit Tests', () => {


    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.doesNotThrow(() => solver.validate(validPuzzleString));
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.doesNotThrow(() => solver.validate(invalidPuzzleString));        
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.doesNotThrow(() => solver.validate(tooLongValidPuzzleString));   
    });

    test('Logic handles a valid row placement', () => {
        assert.doesNotThrow(() => solver.checkRowPlacement(validPuzzleString, 0, 2, 4));
    });

    test('Logic handles an invalid row placement', () => {
        assert.doesNotThrow(() => solver.checkRowPlacement(validPuzzleString, 0, 2, 5));
    });

    test('Logic handles a valid column placement', () => {
        assert.doesNotThrow(() => solver.checkRowPlacement(validPuzzleString, 0, 2, 4));
    });

    test('Logic handles an invalid column placement', () => {
        assert.doesNotThrow(() => solver.checkRowPlacement(validPuzzleString, 0, 2, 5));
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.doesNotThrow(() => solver.checkRegionPlacement(validPuzzleString, 0, 2, 4));
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.doesNotThrow(() => solver.checkRegionPlacement(validPuzzleString, 0, 2, 5));
    });

    test('Valid puzzle strings pass the solver', () => {
        assert.doesNotThrow(() => solver.validate(validPuzzleString));
    });

    test('Invalid puzzle strings fail the solver', () => {
        assert.doesNotThrow(() => solver.validate(invalidPuzzleString));
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve(invalidPuzzleString), false, "Correct invalid straing");
    });


});


/*


*/