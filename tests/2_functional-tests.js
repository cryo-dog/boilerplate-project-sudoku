const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzleString = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let validUnsolvablePuzzleString = "..9.25.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

let validButDoublePuzzleString = ".99..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

let tooLongValidPuzzleString = "5...3.3..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let invalidPuzzleString = "53x.7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";
let invalidPuzzleString2 = "53xx7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";

let solvedValidPuzzleString = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";


suite('Functional Tests', () => {
    
    suite('POST /api/solve', () => {

        test('Solve a puzzle with valid puzzle string', (done) => {
          chai.request(server)
            .post('/api/solve')
            .send({ "puzzle": validPuzzleString })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "solution");
              done();
            });
        });
    
        test('Solve a puzzle with missing puzzle string', (done) => {
          chai.request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'Required field missing');
              done();
            });
        });
    
        test('Solve a puzzle with invalid characters', (done) => {
          chai.request(server)
            .post('/api/solve')
            .send({ "puzzle": invalidPuzzleString })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'Invalid characters in puzzle');
              done();
            });
        });
    
        test('Solve a puzzle with incorrect length', (done) => {
          chai.request(server)
            .post('/api/solve')
            .send({ "puzzle": tooLongValidPuzzleString })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            });
        });
    
        test('Solve a puzzle that cannot be solved', (done) => {
          chai.request(server)
            .post('/api/solve')
            .send({ puzzle: validUnsolvablePuzzleString })
            .end((err, res) => {
              assert.equal(res.body.error, 'Puzzle cannot be solved');
              done();
            });
        });
    
      });

      suite('POST /api/check', () => {

        test('Check a puzzle placement with all fields', (done) => {
          chai.request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzleString, 
                coordinate: 'A3', 
                value: '4' })
            .end((err, res) => {
              assert.equal(res.body.valid, true);
              done();
            });
        });

        // Check a puzzle placement with single placement conflict: POST request to /api/check
        test('Check a puzzle placement with single placement conflict', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: invalidPuzzleString,
                coordinate: 'A2',
                value: '1'
            })
            .end((err, res) => {
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
        });

        // Check a puzzle placement with multiple placement conflicts
test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidPuzzleString2,
        coordinate: "A1",
        value: "2"
      })
      .end((err, res) => { 
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  
  // Check a puzzle placement with all placement conflicts
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        coordinate: "A1",
        value: "1"
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  
  // Check a puzzle placement with missing required fields
  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: "A1"
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  
  // Check a puzzle placement with invalid characters
  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidPuzzleString,
        coordinate: "A1",
        value: "1"
      })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  
  // Check a puzzle placement with incorrect length
  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: tooLongValidPuzzleString,
        coordinate: "A1",
        value: "1"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  
  // Check a puzzle placement with invalid placement coordinate
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: "J1",
        value: "1"
      })
      .end((err, res) => {
        console.log(res.body);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  
// Check a puzzle placement with invalid placement value
test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A1',
        value: '0',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error,"Invalid value");
        done();
      });
  });
  

    });

});

