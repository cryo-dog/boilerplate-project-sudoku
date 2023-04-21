require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');

const fccTestingRoutes  = require('./routes/fcctesting.js');
const apiRoutes         = require('./routes/api.js');
const runner            = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// TR: Print all requests to the console
function logRequests(req, res, next) {
  console.log('----New request at: ' + req.method + '' + req.url);
  console.log('Values at 1. body, query, param');
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  next();
}

app.use(logRequests);

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
  // process.env.NODE_ENV='test'
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
