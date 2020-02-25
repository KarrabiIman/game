const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const app = express();
const router = express.Router();
const API_PORT = 3001;
const scores = {"player0": 0, "player1": 0};
var winScore = 100;

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static('client'));

router.post('/win-score', (req, res) => {
  winScore = req.body.winScore;
  console.log(`Win score changed to ${winScore}`);
  return res.json({"success": true});
});

router.post('/score', (req, res) => {
  var newScore = req.body.newScore;
  console.log(`Changing new score of the player to ${newScore}`);
  scores[newScore.name] += newScore.point;
  console.log(`Score of the player: [${newScore.name}] changed ${scores[newScore.name]}`);
  const winner = checkWinner();
  if (winner) {
    console.log(`Winner selected. [${winner}]`);
    //resetScores();
  }
  return res.json({"success": true, "winner": winner, "score": scores[newScore.name]});
});

router.post('/new-game', (req, res) => {
  console.log('A new game has started.');
  resetScores();
  return res.json({"success": true});
});

var checkWinner = function() {
  for (var item in scores) {
    if (scores[item] >= winScore) {
      return item;
    }
  }

  return null;
}

var resetScores = function() {
  for (var item in scores) {
    scores[item] = 0;
  }
}

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));